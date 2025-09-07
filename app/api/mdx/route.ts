import { readFile } from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const path = searchParams.get("path");

		if (!path) {
			return NextResponse.json(
				{ error: "Path parameter is required" },
				{ status: 400 },
			);
		}

		// Security: Only allow paths within content/docs
		if (
			(!path.startsWith("/docs/") && path !== "/docs") ||
			path.includes("..")
		) {
			return NextResponse.json({ error: "Invalid path" }, { status: 400 });
		}

		// Remove /docs prefix and add .mdx extension if not present
		let filePath;
		if (path === "/docs") {
			filePath = "index";
		} else {
			filePath = path.replace("/docs/", "");
			// Handle root docs path
			if (filePath === "" || filePath === "/") {
				filePath = "index";
			}
		}

		if (!filePath.endsWith(".mdx")) {
			filePath += ".mdx";
		}

		const fullPath = join(process.cwd(), "content", "docs", filePath);

		try {
			const content = await readFile(fullPath, "utf-8");

			return new NextResponse(content, {
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					"Cache-Control": "public, max-age=3600", // Cache for 1 hour
				},
			});
		} catch (fileError) {
			console.error("File read error:", fileError);
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}
	} catch (error) {
		console.error("API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
