#!/usr/bin/env python3
"""
TypeScript Error Fixer
Automatically fixes common TypeScript errors in the project
"""

import re
import os
from pathlib import Path

# Define file paths and fixes
fixes = [
    # AdminDashboard.tsx - already fixed above

    # BlogCategories.tsx
    {
        "file": "src/admin/BlogCategories.tsx",
        "fixes": [
            {
                "find": r"  Search, X, Save, Folder",
                "replace": "  Search, X, Save"
            },
            {
                "find": r"      parent_id: category.parent_id,",
                "replace": "      parent_id: category.parent_id ?? undefined,"
            }
        ]
    },

    # BlogEditor.tsx
    {
        "file": "src/admin/BlogEditor.tsx",
        "fixes": [
            {
                "find": r"import { Save, Eye, Bold, Italic, Underline, List, ListOrdered, Link2, Image, Calendar,\n  Code, Quote, Heading, Type, AlignLeft, AlignCenter, AlignRight,\n  Undo2, ChevronDown, Undo, Redo, X as XIcon, Plus\n} from 'lucide-react';",
                "replace": "import { Save, Eye, Bold, Italic, Underline, List, ListOrdered, Link2, Image,\n  Code, Quote, Heading, AlignLeft, AlignCenter,\n  Undo2, ChevronDown, XIcon, Plus\n} from 'lucide-react';"
            }
        ]
    },

    # BlogManagement.tsx
    {
        "file": "src/admin/BlogManagement.tsx",
        "fixes": [
            {
                "find": r"import { Plus, Search, Edit2, Trash2, Eye, Copy, PenTool, Tag, Filter,\n  Calendar, User, TrendingUp, MoreHorizontal, X,\n  ChevronDown, FileText, ImageIcon,\n  CheckCircle2, Settings, BarChart3, Clock\n} from 'lucide-react';",
                "replace": "import { Plus, Search, Edit2, Trash2, Eye, Copy, Tag,\n  TrendingUp, X,\n  ChevronDown, FileText,\n  CheckCircle2, Clock\n} from 'lucide-react';"
            },
            {
                "find": r"import { formatPersianCurrency, formatPersianNumber, formatPersianDateTime, getPersianStatus } from '../utils/persian';",
                "replace": "import { formatPersianNumber, getPersianStatus } from '../utils/persian';"
            },
            {
                "find": r"  const \[sortBy, setSortBy\] = useState<keyof BlogPost>",
                "replace": "  const [sortBy] = useState<keyof BlogPost>"
            },
            {
                "find": r"  const \[sortOrder, setSortOrder\] = useState<'asc' \| 'desc'>",
                "replace": "  const [sortOrder] = useState<'asc' | 'desc'>"
            },
            {
                "find": r"      const comparison = String\(aValue\).localeCompare\(String\(bValue\), 'fa'\);",
                "replace": "      const comparison = String(aValue ?? '').localeCompare(String(bValue ?? ''), 'fa');"
            }
        ]
    },

    # iranian-validation.ts
    {
        "file": "src/utils/iranian-validation.ts",
        "fixes": [
            {
                "find": r"    postalCode\[i\]",
                "replace": "    postalCode?.[i]"
            },
            {
                "find": r"  for \(let i = 0; i < iban.length; i\+\+\) {",
                "replace": "  for (let i = 0; i < (iban?.length ?? 0); i++) {"
            }
        ]
    },

    # persian.ts
    {
        "file": "src/utils/persian.ts",
        "fixes": [
            {
                "find": r"  return str.replace\(/\[0-9\]/g, \(w\) => persianNumbers\[parseInt\(w\)\]\);",
                "replace": "  return (str ?? '').replace(/[0-9]/g, (w) => persianNumbers[parseInt(w)]);"
            }
        ]
    }
]

def apply_fixes():
    """Apply all fixes to the files"""
    project_root = Path(__file__).parent

    for file_config in fixes:
        file_path = project_root / file_config["file"]

        if not file_path.exists():
            print(f"⚠️  File not found: {file_path}")
            continue

        print(f"🔧 Fixing {file_config['file']}...")

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        for fix in file_config["fixes"]:
            content = re.sub(fix["find"], fix["replace"], content, flags=re.MULTILINE)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed {file_config['file']}")
        else:
            print(f"ℹ️  No changes needed in {file_config['file']}")

if __name__ == "__main__":
    print("🚀 Starting TypeScript Error Fixes...\n")
    apply_fixes()
    print("\n✨ All fixes applied!")
    print("\n📝 Next steps:")
    print("   1. Run: npm run type-check")
    print("   2. Fix any remaining errors manually")
    print("   3. Run: npm run build")
