export function whatsappHref(number, text) {
  const digits = String(number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function instagramHref(handle) {
  const name = String(handle || "").replace(/^@/, "");
  return `https://instagram.com/${name}`;
}

export function bookingText(serviceName) {
  if (serviceName) {
    return `Hello Maria, I would like to book ${serviceName}.`;
  }
  return "Hello Maria, I would like to book an appointment at HTLSTUDIO.";
}
