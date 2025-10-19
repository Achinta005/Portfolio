// File: app/api/anilist/export/route.js

import Animepool from '@/app/lib/animeDB';
import { NextResponse } from 'next/server';

async function fetchFromDatabase(username, filter) {
  const connection = await Animepool.getConnection();

  try {
    let query = `
      SELECT 
        al.*,
        ad.title_romaji,
        ad.title_english,
        ad.title_native,
        ad.cover_image_large,
        ad.cover_image_medium,
        ad.episodes,
        ad.format,
        ad.genres,
        ad.average_score,
        ad.description
      FROM anime_list al
      LEFT JOIN anime_details ad ON al.media_id = ad.id
      WHERE al.username = ?
    `;

    const params = [username];

    if (filter && filter !== 'ALL') {
      query += ` AND al.status = ?`;
      params.push(filter);
    }

    query += ` ORDER BY al.updated_at DESC`;

    const [rows] = await connection.execute(query, params);

    return rows.map(row => ({
      ...row,
      genres: typeof row.genres === 'string' ? JSON.parse(row.genres) : row.genres
    }));
  } finally {
    connection.release();
  }
}

function generateJSON(animeList) {
  return JSON.stringify(animeList, null, 2);
}

function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateXML(animeList) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<animeList>\n';
  
  animeList.forEach(anime => {
    xml += '  <anime>\n';
    xml += `    <id>${anime.id}</id>\n`;
    xml += `    <mediaId>${anime.media_id}</mediaId>\n`;
    xml += `    <username>${escapeXML(anime.username)}</username>\n`;
    xml += `    <titleRomaji>${escapeXML(anime.title_romaji || '')}</titleRomaji>\n`;
    xml += `    <titleEnglish>${escapeXML(anime.title_english || '')}</titleEnglish>\n`;
    xml += `    <titleNative>${escapeXML(anime.title_native || '')}</titleNative>\n`;
    xml += `    <status>${anime.status}</status>\n`;
    xml += `    <score>${anime.score || 0}</score>\n`;
    xml += `    <progress>${anime.progress}</progress>\n`;
    xml += `    <episodes>${anime.episodes || 'N/A'}</episodes>\n`;
    xml += `    <format>${escapeXML(anime.format || 'N/A')}</format>\n`;
    xml += `    <averageScore>${anime.average_score || 0}</averageScore>\n`;
    
    if (anime.genres && Array.isArray(anime.genres) && anime.genres.length > 0) {
      xml += '    <genres>\n';
      anime.genres.forEach(genre => {
        xml += `      <genre>${escapeXML(genre)}</genre>\n`;
      });
      xml += '    </genres>\n';
    }
    
    if (anime.started_at) {
      xml += `    <startedAt>${anime.started_at}</startedAt>\n`;
    }
    
    if (anime.completed_at) {
      xml += `    <completedAt>${anime.completed_at}</completedAt>\n`;
    }
    
    xml += `    <coverImage>${escapeXML(anime.cover_image_large || anime.cover_image_medium || '')}</coverImage>\n`;
    xml += `    <repeatCount>${anime.repeat_count || 0}</repeatCount>\n`;
    xml += `    <syncedAt>${anime.synced_at}</syncedAt>\n`;
    
    if (anime.description) {
      xml += `    <description>${escapeXML(anime.description)}</description>\n`;
    }
    
    xml += '  </anime>\n';
  });
  
  xml += '</animeList>';
  return xml;
}

export async function POST(request) {
  try {
    const { username, format, filter } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    if (!format || !['json', 'xml'].includes(format.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid format. Must be json or xml' },
        { status: 400 }
      );
    }

    console.log(`Exporting ${format.toUpperCase()} for: ${username}, filter: ${filter || 'ALL'}`);

    const animeList = await fetchFromDatabase(username, filter);

    if (animeList.length === 0) {
      return NextResponse.json(
        { error: 'No anime list found for this user' },
        { status: 404 }
      );
    }

    let content;
    let contentType;
    const normalizedFormat = format.toLowerCase();

    if (normalizedFormat === 'json') {
      content = generateJSON(animeList);
      contentType = 'application/json';
    } else if (normalizedFormat === 'xml') {
      content = generateXML(animeList);
      contentType = 'application/xml';
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${username}_anime_list.${normalizedFormat}"`,
      },
    });

  } catch (error) {
    console.error('Export Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}