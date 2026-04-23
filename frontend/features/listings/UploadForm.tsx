"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateProductDescription } from "@/lib/api/ai";
import { apiCreateProduct, UnauthorizedError } from "@/lib/api/products";
import type { CreateProductRequest } from "@/lib/api/types";
import { apiUploadImages } from "@/lib/api/upload";
import styles from "./UploadForm.module.css";

const CONDITIONS: { value: CreateProductRequest["condition"]; label: string }[] =
  [
    { value: "new", label: "New" },
    { value: "like_new", label: "Like new" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
  ];

const CATEGORIES: { value: CreateProductRequest["category"]; label: string }[] =
  [
    { value: "shirt", label: "Shirt" },
    { value: "pants", label: "Pants" },
    { value: "shoes", label: "Shoes" },
    { value: "jacket", label: "Jacket" },
    { value: "knitwear", label: "Knitwear" },
    { value: "others", label: "Others" },
  ];

const KNIT_TYPES: { value: string; label: string }[] = [
  { value: "scarf", label: "Scarf" },
  { value: "sweater", label: "Sweater" },
  { value: "hat", label: "Hat" },
  { value: "custom", label: "Custom" },
];

type Props = {
  accessToken: string;
  email: string;
  role?: string;
  onAuthLost: () => void;
};

export function UploadForm({ accessToken, email, role, onAuthLost }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<CreateProductRequest["condition"]>("like_new");
  const [category, setCategory] = useState<CreateProductRequest["category"]>("others");
  const [size, setSize] = useState("M");
  const [description, setDescription] = useState("");
  
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isKnitwear, setIsKnitwear] = useState(false);
  const [knitType, setKnitType] = useState<CreateProductRequest["knitType"]>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // RBAC: Only admin can upload
  const isAdmin = role === "admin";

  useEffect(() => {
    if (category === "knitwear") {
      setIsKnitwear(true);
    }
  }, [category]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (!files.length) return;
    setError(null);
    
    const remaining = Math.max(0, 10 - imageUrls.length);
    const picked = Array.from(files).slice(0, remaining).filter(f => f.type.startsWith("image/"));
    
    if (picked.length === 0) {
      if (imageUrls.length >= 10) setError("Maximum 10 images allowed.");
      return;
    }

    setUploading(true);
    try {
      const results = await apiUploadImages(accessToken, picked);
      setImageUrls(prev => [...prev, ...results.map(r => r.secureUrl)]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [accessToken, imageUrls.length]);

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAiDraft() {
    setError(null);
    if (!title.trim()) {
      setError("Add a title first so the AI has context.");
      return;
    }
    setAiLoading(true);
    try {
      const text = await generateProductDescription(accessToken, {
        title: title.trim(),
        condition,
      });
      setDescription(text.slice(0, 5000));
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI draft failed");
    } finally {
      setAiLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (imageUrls.length === 0) {
      setError("At least one image is required.");
      return;
    }

    if (isKnitwear && !knitType) {
      setError("Please select a knit type for your knitwear item.");
      return;
    }

    setSubmitting(true);
    try {
      const body: CreateProductRequest = {
        title: title.trim(),
        price: priceNum,
        condition,
        category,
        size: size.trim(),
        description: description.trim(),
        images: imageUrls,
        isKnitwear,
        knitType: isKnitwear ? knitType : null,
        handmade: isKnitwear ? true : false,
      };
      const { product } = await apiCreateProduct(accessToken, body);
      router.push(`/products/${product.id}`);
      router.refresh();
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        onAuthLost();
        return;
      }
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className={styles.restrictedView}>
        <h1>Curated Access Only</h1>
        <p className={styles.subtitle}>
          Mei Closet is currently in curated mode. Only approved designers can list items.
        </p>
        <Link href="/" style={{ marginTop: "1rem", display: "inline-block", color: "var(--primary)" }}>
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>New Listing</h1>
        <p className={styles.subtitle}>Curating for {email}</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Photos ({imageUrls.length}/10)</label>
          <div 
            className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneActive : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              multiple 
              accept="image/*" 
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files!)}
            />
            {uploading ? (
              <p>Uploading items...</p>
            ) : (
              <p>Drag photos here or click to browse</p>
            )}
          </div>
          
          <div className={styles.previewGrid}>
            {imageUrls.map((url, i) => (
              <div key={url} className={styles.previewItem}>
                <Image src={url} alt="" fill className="object-cover" />
                <button type="button" className={styles.removeBtn} onClick={() => removeImage(i)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title</label>
          <input 
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Vintage Oversized Blazer"
            required 
          />
        </div>

        <div className={styles.gridRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Price (USD)</label>
            <input 
              className={styles.input}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required 
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Size</label>
            <input 
              className={styles.input}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="M"
              required 
            />
          </div>
        </div>

        <div className={styles.gridRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as any)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Condition</label>
            <select className={styles.select} value={condition} onChange={(e) => setCondition(e.target.value as any)}>
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <p className={styles.label}>🧶 🧶 🧶 part of Knit Studio?</p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Handcrafted unique pieces</p>
          </div>
          <input 
            type="checkbox" 
            checked={isKnitwear} 
            onChange={(e) => setIsKnitwear(e.target.checked)}
            style={{ width: "1.5rem", height: "1.5rem", cursor: "pointer" }}
          />
        </div>

        {isKnitwear && (
          <div className={styles.fieldGroup} style={{ animation: "fadeIn 0.3s ease" }}>
            <label className={styles.label}>Knit Type</label>
            <select className={styles.select} value={knitType || ""} onChange={(e) => setKnitType(e.target.value as any)}>
              <option value="" disabled>Select type...</option>
              {KNIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        )}

        <div className={styles.fieldGroup}>
          <div className="flex justify-between items-center">
            <label className={styles.label}>Description</label>
            <button 
              type="button" 
              onClick={handleAiDraft} 
              disabled={aiLoading}
              className="text-xs font-semibold text-violet-600 border border-violet-200 px-2 py-1 rounded-full hover:bg-violet-50 transition"
            >
              {aiLoading ? "Thinking..." : "✨ AI Draft"}
            </button>
          </div>
          <textarea 
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Fabric details, fit, and story..."
          />
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <button type="submit" className={styles.submitBtn} disabled={submitting || uploading}>
          {submitting ? "Publishing..." : "Publish Creation"}
        </button>
      </form>
    </div>
  );
}
