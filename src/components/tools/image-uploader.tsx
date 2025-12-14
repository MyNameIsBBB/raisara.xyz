import { useRef } from "react";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
}

export function ImageUploader({ onFileSelect }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            onFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">
                        คลิกเพื่อเลือกไฟล์ หรือลากรูปมาวางที่นี่
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        รองรับ JPG, PNG, WEBP (สูงสุด 10MB)
                    </p>
                </div>
            </div>
        </div>
    );
}
