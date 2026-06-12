import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoColorPaletteOutline, IoTextOutline, IoTimeOutline, IoLinkOutline, IoCheckmarkCircle, IoCloseCircleOutline } from "react-icons/io5";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const COLOR_OPTIONS = [
  { label: "Purple", from: "#7F77DD", to: "#534AB7" },
  { label: "Coral",  from: "#D85A30", to: "#993C1D" },
  { label: "Teal",   from: "#1D9E75", to: "#0F6E56" },
  { label: "Blue",   from: "#378ADD", to: "#185FA5" },
  { label: "Pink",   from: "#D4537E", to: "#993556" },
  { label: "Amber",  from: "#BA7517", to: "#854F0B" },
  { label: "Dark",   from: "#1a1a2e", to: "#16213e" },
];

const DEFAULT_FORM = {
  enabled: false,
  title: "",
  description: "",
  ctaText: "",
  ctaLink: "",
  emoji: "🎁",
  delaySeconds: 1,
  colorFrom: "#7F77DD",
  colorTo: "#534AB7",
};

const Promo = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing promo config on mount
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/promo/admin");
        if (res.data) setFormData({ ...DEFAULT_FORM, ...res.data });
      } catch {
        // No existing config yet — keep defaults
      } finally {
        setFetching(false);
      }
    };
    fetchPromo();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleToggle = () => {
    setFormData({ ...formData, enabled: !formData.enabled });
  };

  const handleColorSelect = (from, to) => {
    setFormData({ ...formData, colorFrom: from, colorTo: to });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(backendUrl + "/api/promo/admin", formData);
      toast.success("Promo banner saved successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save promo banner.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Promo Banner</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure the popup shown to visitors on the website.</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            formData.enabled ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {formData.enabled
            ? <IoCheckmarkCircle size={13} />
            : <IoCloseCircleOutline size={13} />}
          {formData.enabled ? "Active" : "Inactive"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Enable Toggle */}
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-800">Enable Promo Banner</p>
            <p className="text-xs text-gray-500 mt-0.5">Show popup to visitors when they open the website</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.enabled}
            onClick={handleToggle}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 ${
              formData.enabled ? "bg-violet-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                formData.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Title + CTA Text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <IoTextOutline size={13} /> Promo Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Summer Sale is Here 🎉"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <IoTextOutline size={13} /> CTA Button Text
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              placeholder="e.g. Shop Now →"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your offer..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Emoji / Delay / Link */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Emoji / Icon
            </label>
            <input
              type="text"
              name="emoji"
              value={formData.emoji}
              onChange={handleChange}
              placeholder="🎁"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <IoTimeOutline size={13} /> Delay (seconds)
            </label>
            <input
              type="number"
              name="delaySeconds"
              value={formData.delaySeconds}
              onChange={handleChange}
              min={0}
              max={30}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <IoLinkOutline size={13} /> CTA Link
            </label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              placeholder="/sale"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <IoColorPaletteOutline size={13} /> Banner Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.label}
                type="button"
                title={c.label}
                onClick={() => handleColorSelect(c.from, c.to)}
                className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${
                  formData.colorFrom === c.from
                    ? "ring-2 ring-offset-2 ring-gray-700 scale-110"
                    : ""
                }`}
                style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
              />
            ))}
          </div>
        </div>

        {/* Preview strip */}
        <div
          className="rounded-xl overflow-hidden border border-gray-200"
          style={{ background: `linear-gradient(135deg, ${formData.colorFrom}, ${formData.colorTo})` }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-2xl">{formData.emoji || "🎁"}</span>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">
                {formData.title || "Your promo title here"}
              </p>
              <p className="text-xs text-white/75 mt-0.5">
                {formData.description || "Your description will appear here."}
              </p>
            </div>
            <span className="ml-auto text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
              {formData.ctaText || "CTA"}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: `linear-gradient(135deg, ${formData.colorFrom}, ${formData.colorTo})` }}
        >
          {loading ? "Saving..." : "Save & Publish"}
        </button>

      </form>
    </div>
  );
};

export default Promo;