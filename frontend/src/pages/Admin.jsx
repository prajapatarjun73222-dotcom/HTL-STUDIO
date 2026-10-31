import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getToken, setToken } from "../api";
import { useSite } from "../site";

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StudioForm({ settings, onSaved }) {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setForm({
      ...settings,
      hours: (settings.hours || []).map((hour) => ({ ...hour })),
      notes: [...(settings.notes || [])],
    });
  }, [settings]);

  if (!form) return null;

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          notes: String(form.notesText ?? (form.notes || []).join("\n"))
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });
      await onSaved();
      setMessage("Saved");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setPending(false);
    }
  }

  const notesValue = form.notesText ?? (form.notes || []).join("\n");

  return (
    <form onSubmit={save} className="desk-card">
      <Field label="Headline">
        <input value={form.headline || ""} onChange={(event) => setField("headline", event.target.value)} />
      </Field>
      <Field label="Location line">
        <input value={form.eyebrow || ""} onChange={(event) => setField("eyebrow", event.target.value)} />
      </Field>
      <Field label="Intro title">
        <input value={form.introTitle || ""} onChange={(event) => setField("introTitle", event.target.value)} />
      </Field>
      <Field label="About">
        <textarea value={form.about || ""} onChange={(event) => setField("about", event.target.value)} />
      </Field>
      <Field label="Work introduction">
        <textarea value={form.workIntro || ""} onChange={(event) => setField("workIntro", event.target.value)} />
      </Field>
      <Field label="Before and after introduction">
        <textarea value={form.baIntro || ""} onChange={(event) => setField("baIntro", event.target.value)} />
      </Field>
      <Field label="Services introduction">
        <textarea value={form.servicesIntro || ""} onChange={(event) => setField("servicesIntro", event.target.value)} />
      </Field>
      <div className="split-fields">
        <Field label="Address">
          <input value={form.address || ""} onChange={(event) => setField("address", event.target.value)} />
        </Field>
        <Field label="Place note">
          <input value={form.placeNote || ""} onChange={(event) => setField("placeNote", event.target.value)} />
        </Field>
      </div>
      <Field label="Map search">
        <input value={form.mapQuery || ""} onChange={(event) => setField("mapQuery", event.target.value)} />
      </Field>
      <div className="split-fields">
        <Field label="WhatsApp number">
          <input value={form.whatsapp || ""} onChange={(event) => setField("whatsapp", event.target.value)} />
        </Field>
        <Field label="Instagram handle">
          <input value={form.instagramHandle || ""} onChange={(event) => setField("instagramHandle", event.target.value)} />
        </Field>
      </div>
      <div className="split-fields three">
        <Field label="Posts">
          <input
            type="number"
            value={form.instagramPosts ?? 0}
            onChange={(event) => setField("instagramPosts", event.target.value)}
          />
        </Field>
        <Field label="Followers">
          <input
            type="number"
            value={form.instagramFollowers ?? 0}
            onChange={(event) => setField("instagramFollowers", event.target.value)}
          />
        </Field>
        <Field label="Following">
          <input
            type="number"
            value={form.instagramFollowing ?? 0}
            onChange={(event) => setField("instagramFollowing", event.target.value)}
          />
        </Field>
      </div>
      <Field label="Opening image URL">
        <input value={form.heroImage || ""} onChange={(event) => setField("heroImage", event.target.value)} />
      </Field>
      <Field label="Portrait image URL">
        <input value={form.portraitImage || ""} onChange={(event) => setField("portraitImage", event.target.value)} />
      </Field>
      <Field label="Payment note">
        <input value={form.paymentNote || ""} onChange={(event) => setField("paymentNote", event.target.value)} />
      </Field>
      <Field label="Notes, one per line">
        <textarea
          value={notesValue}
          onChange={(event) => setForm((current) => ({ ...current, notesText: event.target.value }))}
        />
      </Field>
      <div className="hours-edit">
        {(form.hours || []).map((hour, index) => (
          <div className="hour-edit" key={hour.day}>
            <span>{hour.day}</span>
            <input
              value={hour.open}
              aria-label={`${hour.day} opening time`}
              onChange={(event) => {
                const hours = form.hours.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, open: event.target.value } : row
                );
                setField("hours", hours);
              }}
            />
            <input
              value={hour.close}
              aria-label={`${hour.day} closing time`}
              onChange={(event) => {
                const hours = form.hours.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, close: event.target.value } : row
                );
                setField("hours", hours);
              }}
            />
          </div>
        ))}
      </div>
      <div className="editor-actions">
        <button className="book button" type="submit" disabled={pending}>
          {pending ? "Saving" : "Save studio"}
        </button>
        {message && <p className="save-note">{message}</p>}
      </div>
    </form>
  );
}

function ServiceEditor({ item, onChange }) {
  const [form, setForm] = useState(item);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function save(event) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      await api(`/api/admin/services/${item._id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      await onChange();
      setMessage("Saved");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="editor" onSubmit={save}>
      <div className="editor-main">
        <Field label="Name">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </Field>
        <div className="split-fields three">
          <Field label="Kind">
            <select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })}>
              <option value="method">Method</option>
              <option value="treatment">Treatment</option>
            </select>
          </Field>
          <Field label="Duration">
            <input value={form.duration || ""} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
          </Field>
          <Field label="Price (£)">
            <input
              type="number"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
            />
          </Field>
        </div>
        <Field label="Description">
          <input
            value={form.description || ""}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </Field>
        <Field label="Image URL">
          <input value={form.imageUrl || ""} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
        </Field>
      </div>
      {form.imageUrl && <img className="thumb" src={form.imageUrl} alt="" />}
      <div className="editor-actions">
        <button className="book button" type="submit" disabled={pending}>
          Save
        </button>
        <button
          className="quiet"
          type="button"
          onClick={async () => {
            await api(`/api/admin/services/${item._id}`, { method: "DELETE" });
            await onChange();
          }}
        >
          Remove
        </button>
        {message && <p className="save-note">{message}</p>}
      </div>
    </form>
  );
}

function GalleryEditor({ item, onChange }) {
  const [form, setForm] = useState(item);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const preview = form.kind === "pair" ? form.afterUrl || form.beforeUrl : form.imageUrl;

  async function save(event) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      await api(`/api/admin/gallery/${item._id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      await onChange();
      setMessage("Saved");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="editor" onSubmit={save}>
      <div className="editor-main">
        <Field label="Kind">
          <select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })}>
            <option value="work">Photograph</option>
            <option value="pair">Before and after</option>
          </select>
        </Field>
        <Field label="Caption">
          <input value={form.caption || ""} onChange={(event) => setForm({ ...form, caption: event.target.value })} />
        </Field>
        {form.kind === "work" ? (
          <Field label="Image URL">
            <input value={form.imageUrl || ""} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          </Field>
        ) : (
          <>
            <Field label="Before URL">
              <input value={form.beforeUrl || ""} onChange={(event) => setForm({ ...form, beforeUrl: event.target.value })} />
            </Field>
            <Field label="After URL">
              <input value={form.afterUrl || ""} onChange={(event) => setForm({ ...form, afterUrl: event.target.value })} />
            </Field>
          </>
        )}
      </div>
      {preview && <img className="thumb" src={preview} alt="" />}
      <div className="editor-actions">
        <button className="book button" type="submit" disabled={pending}>
          Save
        </button>
        <button
          className="quiet"
          type="button"
          onClick={async () => {
            await api(`/api/admin/gallery/${item._id}`, { method: "DELETE" });
            await onChange();
          }}
        >
          Remove
        </button>
        {message && <p className="save-note">{message}</p>}
      </div>
    </form>
  );
}

export function Admin() {
  const { settings, services, gallery, reload } = useSite();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("studio");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    api("/api/auth/me")
      .then(() => setAuthed(true))
      .catch(() => setToken(""))
      .finally(() => setChecking(false));
  }, []);

  async function login(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(result.token);
      setAuthed(true);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  async function move(list, index, direction, path) {
    const next = index + direction;
    if (next < 0 || next >= list.length) return;
    const ids = list.map((item) => item._id);
    const swapped = [...ids];
    [swapped[index], swapped[next]] = [swapped[next], swapped[index]];
    await api(path, { method: "POST", body: JSON.stringify({ ids: swapped }) });
    await reload();
  }

  async function addService() {
    await api("/api/admin/services", {
      method: "POST",
      body: JSON.stringify({
        name: "New service",
        duration: "1 hour",
        price: 0,
        kind: "treatment",
        description: "",
        imageUrl: "",
      }),
    });
    await reload();
  }

  async function addGallery(kind) {
    await api("/api/admin/gallery", {
      method: "POST",
      body: JSON.stringify({
        kind,
        caption: kind === "pair" ? "New transformation" : "New photograph",
        imageUrl: "",
        beforeUrl: "",
        afterUrl: "",
      }),
    });
    await reload();
  }

  if (checking) {
    return <p className="status">Opening the desk…</p>;
  }

  if (!authed) {
    return (
      <div className="login">
        <p className="kicker">HTLSTUDIO</p>
        <h1>Studio desk</h1>
        <form onSubmit={login}>
          <Field label="Email">
            <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Password">
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          {error && <p className="form-error">{error}</p>}
          <button className="book button" type="submit" disabled={pending}>
            {pending ? "Entering" : "Enter"}
          </button>
        </form>
        <Link to="/" className="text-link">
          Back to the studio
        </Link>
      </div>
    );
  }

  return (
    <div className="desk">
      <header className="desk-bar">
        <div>
          <p className="kicker">HTLSTUDIO</p>
          <h1>Studio desk</h1>
        </div>
        <div className="desk-bar-links">
          <Link to="/">View the site</Link>
          <button
            className="quiet"
            type="button"
            onClick={() => {
              setToken("");
              setAuthed(false);
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="tabs">
        {[
          ["studio", "Studio"],
          ["services", "Services"],
          ["gallery", "Gallery"],
        ].map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? "tab on" : "tab"} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "studio" && <StudioForm settings={settings} onSaved={reload} />}

      {tab === "services" && (
        <section>
          <div className="desk-tools">
            <p>Methods appear as photographs. Treatments appear in the price list.</p>
            <button className="book button" type="button" onClick={addService}>
              Add service
            </button>
          </div>
          {services.map((service, index) => (
            <div key={`${service._id}-${service.updatedAt || index}`} className="desk-card">
              <div className="move-row">
                <button className="quiet" type="button" onClick={() => move(services, index, -1, "/api/admin/services/reorder")}>
                  Up
                </button>
                <button className="quiet" type="button" onClick={() => move(services, index, 1, "/api/admin/services/reorder")}>
                  Down
                </button>
              </div>
              <ServiceEditor item={service} onChange={reload} />
            </div>
          ))}
        </section>
      )}

      {tab === "gallery" && (
        <section>
          <div className="desk-tools">
            <p>Paste an image address. Photographs are not uploaded.</p>
            <div className="desk-bar-links">
              <button className="book button" type="button" onClick={() => addGallery("work")}>
                Add photograph
              </button>
              <button className="book button ghost" type="button" onClick={() => addGallery("pair")}>
                Add before & after
              </button>
            </div>
          </div>
          {gallery.map((item, index) => (
            <div key={`${item._id}-${item.updatedAt || index}`} className="desk-card">
              <div className="move-row">
                <button className="quiet" type="button" onClick={() => move(gallery, index, -1, "/api/admin/gallery/reorder")}>
                  Up
                </button>
                <button className="quiet" type="button" onClick={() => move(gallery, index, 1, "/api/admin/gallery/reorder")}>
                  Down
                </button>
              </div>
              <GalleryEditor item={item} onChange={reload} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
