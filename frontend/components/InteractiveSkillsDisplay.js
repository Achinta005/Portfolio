'use client'
import React, { useState } from 'react';

const InteractiveSkillsDisplay = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const skillsData = {
    frontend: {
      title: "Frontend",
      flow: [
        { stage: "1st", skill: "HTML", description: "Structure & Markup", color: "#e34c26", proficiency: 100 },
        { stage: "2nd", skill: "CSS", description: "Styling & Design", color: "#1572b6", proficiency: 100 },
        { stage: "3rd", skill: "JavaScript", description: "Interactivity", color: "#f7df1e", proficiency: 95 },
        { stage: "4th", skill: "React", description: "Component Framework", color: "#61dafb", proficiency: 90 }
      ]
    },
    backend: {
      title: "Backend",
      flow: [
        { stage: "1st", skill: "Node.js", description: "Runtime Environment", color: "#339933", proficiency: 85 },
        { stage: "2nd", skill: "Express JS", description: "Web Framework", color: "#000000", proficiency: 85 },
        { stage: "3rd", skill: "Python", description: "Server Language", color: "#3776ab", proficiency: 80 }
      ]
    },
    database: {
      title: "Database",
      flow: [
        { stage: "1st", skill: "My SQL", description: "Relational Database", color: "#47a248", proficiency: 100},
        { stage: "2nd", skill: "MongoDB", description: "NoSQL Database", color: "#47a248", proficiency: 100 }
      ]
    },
    framework:{
      title:"Framework",
      flow:[
        {stage: "1st", skill: "React", description: "Component Based User Interface Library", color: "#47a248", proficiency: 70},
        {stage: "2nd", skill: "Next.js", description: "Full Stack React Production Framework", color: "#47a248", proficiency: 70}
      ]
    },
    authentication:{
      title:"Authentication",
      flow:[
        {stage: "1st", skill: "JWT", description: "JSON Web Token Authentication Standard", color: "#47a248", proficiency: 70},
        {stage: "2nd", skill: "OAuth", description: "Open Authorization Protocol For Security", color: "#47a248", proficiency: 70}
      ]
    },
    programming:{
      title:"Programming",
      flow:[
        {stage: "1st", skill: "C", description: "Low Level System Programming Language", color: "#47a248", proficiency: 100},
        {stage: "2nd", skill: "Java", description: "Object Oriented Enterprise Programming Language", color: "#47a248", proficiency: 70},
        {stage: "3rd", skill: "Python", description: "Versatile High Level Programming Language", color: "#1572b6", proficiency: 80}
      ]
    },
    versioncontrol: {
      title: "Version Control",
      flow: [
        { stage: "1st", skill: "Git", description: "Distributed Version Control System Tool", color: "#f05032", proficiency: 90 }
      ]
    }
  };

  const FlowChart = ({ flow, isVisible }) => {
    const stageColors = {
      "1st": "#10b981",
      "2nd": "#ef4444", 
      "3rd": "#3b82f6",
      "4th": "#f59e0b"
    };

    return (
      <div className={`absolute inset-0 bg-white rounded-lg border-2 border-orange-400 p-4 transform transition-all duration-500 ease-in-out ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        <div className="h-full flex flex-col justify-center space-y-3">
          {flow.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex items-center">
                {/* Proficiency circle */}
                <div className="relative w-12 h-12 flex-shrink-0 transform transition-all duration-700 ease-out"
                     style={{ transitionDelay: `${index * 100}ms` }}>
                  {/* Background circle */}
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Progress circle */}
                    <path
                      className="transition-all duration-1000 ease-out"
                      stroke={stageColors[item.stage]}
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${item.proficiency}, 100`}
                      strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{ 
                        transitionDelay: `${index * 200}ms`,
                        strokeDasharray: `${item.proficiency} 100`
                      }}
                    />
                  </svg>
                  {/* Percentage text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{item.proficiency}%</span>
                  </div>
                </div>
                
                {/* Arrow path */}
                <div className="flex-1 ml-2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-2 rounded-lg relative shadow-sm transform transition-all duration-700 ease-out hover:scale-105"
                       style={{ transitionDelay: `${index * 150}ms` }}>
                    {/* Arrow pointer */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1.5 w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-orange-400"></div>
                    
                    <div className="font-semibold text-sm">{item.skill}</div>
                    <div className="text-xs opacity-90">{item.description}</div>
                  </div>
                </div>
              </div>
              
              {/* Connecting curve */}
              {index < flow.length - 1 && (
                <div className="flex justify-center my-1">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="transform transition-all duration-700 ease-out" style={{ transitionDelay: `${index * 200}ms` }}>
                    <path d="M 10 2 Q 15 10 10 18" stroke="#fb923c" strokeWidth="2" fill="none" className="animate-pulse"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 animate-fade-in">Skills Journey</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(skillsData).map(([category, data]) => (
            <div 
              key={category}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Small container with just text */}
              <div className={`bg-white rounded-lg shadow-lg hover:shadow-xl p-4 h-24 flex items-center justify-center transition-all duration-500 ease-in-out transform ${
                hoveredCategory === category 
                  ? 'scale-110 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl' 
                  : 'hover:scale-105 hover:bg-gray-50'
              }`}>
                <h3 className={`font-bold text-center transition-all duration-300 ${
                  hoveredCategory === category ? 'text-white text-lg' : 'text-gray-800 text-base'
                }`}>
                  {data.title}
                </h3>
              </div>
              
              {/* Expanded flow chart */}
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-80 transition-all duration-500 ease-in-out ${
                hoveredCategory === category 
                  ? 'h-auto min-h-96 -translate-y-4 z-20' 
                  : 'h-24 translate-y-0 z-10'
              }`}>
                <FlowChart 
                  flow={data.flow} 
                  isVisible={hoveredCategory === category}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg animate-bounce">Hover to explore My learning path! ✨</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSkillsDisplay;