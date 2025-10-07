export function getOrCreateGuestIdFromClient() {
  const localId = localStorage.getItem("guestId");
  if (localId) return localId;
  const newId = crypto.randomUUID();
  localStorage.setItem("guestId", newId);
  return newId;
}