"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UrlSectionProps {
    url: string;
    setUrl: (val: string) => void;
}

export function UrlSection({ url, setUrl }: UrlSectionProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-11 bg-background"
            />
        </div>
    );
}
