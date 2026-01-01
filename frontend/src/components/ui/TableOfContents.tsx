import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

/**
 * Table of Contents Component
 * 
 * HOW IT WORKS:
 * 1. Parses HTML content to extract headings (H1-H4)
 * 2. Creates a nested tree structure based on heading hierarchy
 * 3. Adds IDs to headings for anchor links
 * 4. Displays clickable TOC with nested indentation
 * 5. Smoothly scrolls to sections when clicked
 */

interface TOCItem {
  id: string;
  text: string;
  level: number; // 1-4 for H1-H4
  children: TOCItem[];
}

interface TableOfContentsProps {
  htmlContent: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ htmlContent, contentRef }) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string>("");

  // Parse HTML and extract headings
  useEffect(() => {
    if (!htmlContent) {
      setTocItems([]);
      return;
    }

    // Wait a bit for the DOM to be ready
    const timer = setTimeout(() => {
      try {
        if (!contentRef?.current) {
          setTocItems([]);
          return;
        }

        // Find all headings in the actual rendered content
        const headings = Array.from(contentRef.current.querySelectorAll("h1, h2, h3, h4"));
        
        if (headings.length === 0) {
          setTocItems([]);
          return;
        }

      // Extract heading data and add IDs
      const headingData: Array<{ text: string; level: number; id: string }> = headings.map((heading, index) => {
        const text = heading.textContent?.trim() || "";
        const tagName = heading.tagName.toLowerCase();
        const level = parseInt(tagName.charAt(1)); // Extract number from h1, h2, etc.
        
        // Generate unique ID if not exists
        let id = heading.id;
        if (!id || id === "") {
          // Create a URL-friendly ID from the heading text
          id = `heading-${index}-${text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "") // Remove special chars
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-") // Replace multiple hyphens with single
            .replace(/^-|-$/g, "")}`; // Remove leading/trailing hyphens
          
          // Ensure uniqueness
          let uniqueId = id;
          let counter = 1;
          while (contentRef.current?.querySelector(`#${uniqueId}`)) {
            uniqueId = `${id}-${counter}`;
            counter++;
          }
          
          heading.id = uniqueId;
          id = uniqueId;
        }
        
        return { text, level, id };
      });

      // Build nested tree structure
      const buildTree = (items: typeof headingData): TOCItem[] => {
        const result: TOCItem[] = [];
        const stack: TOCItem[] = [];

        items.forEach((item) => {
          const tocItem: TOCItem = {
            id: item.id,
            text: item.text,
            level: item.level,
            children: [],
          };

          // Find the correct parent based on level
          while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
            stack.pop();
          }

          if (stack.length === 0) {
            // Top-level item
            result.push(tocItem);
          } else {
            // Child of the last item in stack
            stack[stack.length - 1].children.push(tocItem);
          }

          stack.push(tocItem);
        });

        return result;
      };

      const tree = buildTree(headingData);
      setTocItems(tree);

      // Start with all items collapsed by default
      setExpandedItems(new Set());
      } catch (error) {
        console.error("Error generating table of contents:", error);
        setTocItems([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [htmlContent, contentRef]);

  // Track active section while scrolling
  useEffect(() => {
    if (!contentRef?.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [tocItems, contentRef]);

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = contentRef?.current?.querySelector(`#${id}`);
    if (element) {
      const yOffset = -120; // Offset for fixed header/navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      // Update active ID after a short delay to ensure scroll completes
      setTimeout(() => setActiveId(id), 100);
    }
  };

  // Render TOC item recursively
  const renderTOCItem = (item: TOCItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeId === item.id;

    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            isActive
              ? "font-semibold"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          style={{
            paddingLeft: `${12 + depth * 20}px`,
            ...(isActive ? {
              backgroundColor: "rgba(var(--theme-primary-rgb), 0.1)",
              color: "var(--theme-primary)"
            } : {})
          }}
          onClick={() => {
            scrollToSection(item.id);
            if (hasChildren) {
              toggleExpand(item.id);
            }
          }}
        >
          {hasChildren && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          {!hasChildren && <span className="w-4 h-4" />}
          <span className="text-sm flex-1 truncate">{item.text}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children.map((child) => renderTOCItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto mb-6 lg:mb-0">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
        Table of Contents
      </h3>
      <div className="space-y-1">
        {tocItems.map((item) => renderTOCItem(item))}
      </div>
    </div>
  );
};

