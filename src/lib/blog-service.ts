import fs from "fs";
import path from "path";

export type BlogStatus = "in-progress" | "queued" | "done" | "beta";

export interface BlogPost {
    id: string;
    title: string;
    description: string;
    status: BlogStatus;
    imageUrl?: string;
    createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "src/data/blogs.json");

if (!fs.existsSync(DATA_FILE)) {
    const initialData: BlogPost[] = [
        {
            id: "1",
            title: "Background Remover Tool",
            description:
                "Initial release of the AI-powered background remover.",
            status: "beta",
            createdAt: new Date().toISOString(),
        },
        {
            id: "2",
            title: "Blog System",
            description: "Developing the blog and update system.",
            status: "in-progress",
            createdAt: new Date().toISOString(),
        },
    ];
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

const readBlogs = (): BlogPost[] => {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading blogs file:", error);
        return [];
    }
};

export const getBlogs = async (): Promise<BlogPost[]> => {
    return readBlogs();
};
