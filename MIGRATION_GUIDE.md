# Project Slug Migration Guide

## What Was Fixed

### 1. Database Schema
- Added `slug` column to `projects` table
- Created unique index on `slug` for fast lookups
- Generated slugs for existing projects based on their titles

### 2. Project Creation Flow
**BEFORE:** Form tried to save translations BEFORE creating the project → Foreign key error

**AFTER:** 
1. Form calls `onSave()` which creates the project in database FIRST
2. After project exists, translations are saved (with 500ms delay to ensure project is committed)

### 3. Slug Generation
- Automatic slug generation from English title (e.g., "Ulmus Besshoky JSC" → "ulmus-besshoky-jsc")
- Slugs are URL-friendly: lowercase, hyphens instead of spaces, no special characters
- Falls back to project ID if title is empty

### 4. URL Structure
**BEFORE:** `/portfolio/p1`, `/portfolio/p2`, `/portfolio/p3`

**AFTER:** `/portfolio/ulmus-besshoky-jsc`, `/portfolio/kazphosphate`, etc.

## How to Apply Migration

### Step 1: Run SQL Migration
Execute the SQL script to add slug column and populate existing projects:

\`\`\`bash
# The script is located at: scripts/01_add_slug_to_projects.sql
\`\`\`

This will:
- Add `slug` column to projects table
- Create unique index for performance
- Generate slugs for all existing projects
- Use project ID as fallback for projects without titles

### Step 2: Verify Changes
1. Go to admin panel: `/admin/portfolio`
2. Try creating a new project with an English title
3. Verify the project saves successfully
4. Check that the project URL uses the slug (e.g., `/portfolio/my-project-name`)

### Step 3: Update Existing Projects (Optional)
If you want to update slugs for existing projects:
1. Edit the project in admin panel
2. Update the English title
3. Save - the slug will be automatically regenerated

## Technical Details

### Files Modified
1. `components/admin/news-edit-form-updated.tsx` - Fixed save order
2. `components/admin/news-management.tsx` - Added logging and error handling
3. `lib/supabase-services.ts` - Added slug generation in create/update
4. `lib/utils.ts` - Already had `generateSlug()` function
5. `lib/portfolio-data.ts` - Already supported slug lookups
6. `app/portfolio/[id]/page.tsx` - Already uses slug parameter
7. `app/portfolio/page.tsx` - Already links to slugs

### Slug Generation Logic
\`\`\`typescript
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-")      // Replace spaces with hyphens
    .replace(/-+/g, "-")       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "")   // Remove leading/trailing hyphens
}
\`\`\`

## Troubleshooting

### Issue: "Title is required" error
**Solution:** Enter at least one title (English, Russian, or Kazakh) before saving

### Issue: Foreign key constraint error
**Solution:** This should be fixed now. The project is created BEFORE translations are saved.

### Issue: Old URLs still show /p1, /p2, etc.
**Solution:** Run the SQL migration to add slugs to existing projects

### Issue: Slug conflicts
**Solution:** The slug column has a unique index. If two projects have the same title, you'll need to make one title unique.

## Benefits

1. **SEO-Friendly URLs** - Search engines prefer descriptive URLs
2. **Better UX** - Users can understand what the page is about from the URL
3. **Easier Sharing** - URLs are more memorable and professional
4. **Backward Compatible** - Old project IDs still work as fallback
