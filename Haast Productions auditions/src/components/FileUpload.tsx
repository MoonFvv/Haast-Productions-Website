import React, { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';

interface FileUploadProps {
    id: string;
    label: string;
    required?: boolean;
    accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, required, accept }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = (f: File) => {
        setFile(f);
        if (f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(f);
        } else if (f.type.startsWith('video/')) {
            setPreview('video');
        } else {
            setPreview(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            processFile(e.dataTransfer.files[0]);
            if (inputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(e.dataTransfer.files[0]);
                inputRef.current.files = dt.files;
            }
        }
    };

    const clear = () => {
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const isVideo = accept?.includes('video');

    return (
        <div className="aud-field-group">
            <label htmlFor={id}>{label} {required && <span className="aud-req">*</span>}</label>
            <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{
                    border: `2px dashed ${isDragging ? '#3b82f6' : file ? '#333' : '#1a1a1a'}`,
                    borderRadius: '12px',
                    padding: file ? '0' : '2rem',
                    background: isDragging ? 'rgba(59,130,246,0.1)' : file ? 'transparent' : '#111111',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center' as const,
                    overflow: 'hidden',
                    position: 'relative' as const,
                }}
            >
                <input
                    type="file"
                    id={id}
                    name={id}
                    ref={inputRef}
                    accept={accept}
                    required={required}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && processFile(e.target.files[0])}
                    style={{ display: 'none' }}
                />

                {!file ? (
                    <div>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'rgba(59,130,246,0.1)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem', fontSize: '1.2rem',
                        }}>
                            {isVideo ? '🎬' : '📸'}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#ECECEC', marginBottom: '0.3rem' }}>
                            Drag & drop or <span style={{ color: '#3b82f6' }}>browse</span>
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#333' }}>
                            {isVideo ? 'MP4, MOV up to 100MB' : 'JPG, PNG up to 10MB'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                        {preview && preview !== 'video' ? (
                            <img src={preview} alt="" style={{
                                width: '56px', height: '56px', borderRadius: '8px',
                                objectFit: 'cover', flexShrink: 0,
                            }} />
                        ) : (
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '8px',
                                background: '#111', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                fontSize: '1.3rem',
                            }}>
                                {preview === 'video' ? '🎬' : '📄'}
                            </div>
                        )}
                        <div style={{ flex: 1, textAlign: 'left' as const, minWidth: 0 }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                                {file.name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#666' }}>
                                {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); clear(); }}
                            style={{
                                background: 'none', border: 'none', color: '#666',
                                fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem',
                            }}
                        >×</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
