#!/bin/bash

# Fix BlogEditor.tsx
sed -i 's/Calendar,//g' src/admin/BlogEditor.tsx
sed -i 's/Type,//g' src/admin/BlogEditor.tsx
sed -i 's/AlignRight,//g' src/admin/BlogEditor.tsx
sed -i 's/Undo,//g' src/admin/BlogEditor.tsx
sed -i 's/Redo,//g' src/admin/BlogEditor.tsx
sed -i 's/const \[selectedText, setSelectedText\]/\/\/ const [selectedText, setSelectedText]/g' src/admin/BlogEditor.tsx
sed -i 's/const \[cursorPosition, setCursorPosition\]/\/\/ const [cursorPosition, setCursorPosition]/g' src/admin/BlogEditor.tsx

# Fix BlogManagement.tsx
sed -i 's/PenTool,//g' src/admin/BlogManagement.tsx
sed -i 's/Filter,//g' src/admin/BlogManagement.tsx
sed -i 's/Calendar,//g' src/admin/BlogManagement.tsx
sed -i 's/User,//g' src/admin/BlogManagement.tsx
sed -i 's/MoreHorizontal,//g' src/admin/BlogManagement.tsx
sed -i 's/ImageIcon,//g' src/admin/BlogManagement.tsx
sed -i 's/Settings,//g' src/admin/BlogManagement.tsx
sed -i 's/BarChart3,//g' src/admin/BlogManagement.tsx
sed -i 's/formatPersianDateTime,//g' src/admin/BlogManagement.tsx
sed -i 's/const \[sortBy, setSortBy\]/const [sortBy]/g' src/admin/BlogManagement.tsx
sed -i 's/const \[sortOrder, setSortOrder\]/const [sortOrder]/g' src/admin/BlogManagement.tsx

echo "✅ Unused imports removed!"
