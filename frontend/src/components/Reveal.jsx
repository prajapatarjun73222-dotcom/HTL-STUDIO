import { useEffect, useRef, useState } from "react";

export function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.16 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "on" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SplitTitle({ text, as: Tag = "h1", className = "" }) {
  const value = String(text || "");
  const comma = value.indexOf(",");
  if (comma === -1) {
    return <Tag className={className}>{value}</Tag>;
  }
  return (
    <Tag className={className}>
      {value.slice(0, comma + 1)}
      <br />
      <em>{value.slice(comma + 1).trim()}</em>
    </Tag>
  );
}
