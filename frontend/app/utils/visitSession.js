export function getVisitSessionId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("visit_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visit_session_id", id);
  }
  return id;
}
