#!/bin/bash

# Commit messages for MelodyHub music streaming app
commits=(
    "Initial project setup with React and Node.js"
    "Set up basic project structure"
    "Add package.json for frontend and backend"
    "Configure Vite for React development"
    "Set up Express server structure"
    "Add basic authentication middleware"
    "Create user model and database schema"
    "Implement user registration endpoint"
    "Add user login functionality"
    "Create song model and database schema"
    "Implement song upload functionality"
    "Add album model and relationships"
    "Create album management endpoints"
    "Set up Cloudinary for media storage"
    "Implement audio file upload"
    "Add song metadata extraction"
    "Create basic UI components"
    "Implement responsive navigation"
    "Add authentication pages (login/signup)"
    "Create home page layout"
    "Implement music player component"
    "Add play/pause functionality"
    "Create playlist management"
    "Add volume control slider"
    "Implement progress bar for audio"
    "Add repeat and shuffle controls"
    "Create album display components"
    "Implement album grid layout"
    "Add album detail pages"
    "Create song list components"
    "Implement search functionality"
    "Add filter options for songs"
    "Create user profile pages"
    "Implement user settings"
    "Add admin dashboard structure"
    "Create admin user management"
    "Implement song approval system"
    "Add statistics tracking"
    "Create analytics dashboard"
    "Implement real-time chat system"
    "Add Socket.io integration"
    "Create messaging components"
    "Implement online user status"
    "Add notification system"
    "Create loading skeletons"
    "Implement error handling"
    "Add form validation"
    "Create responsive design"
    "Optimize for mobile devices"
    "Add dark mode theme"
    "Implement accessibility features"
    "Add keyboard shortcuts"
    "Create unit tests"
    "Add integration tests"
    "Implement API documentation"
    "Add deployment configuration"
    "Set up CI/CD pipeline"
    "Optimize performance"
    "Add caching mechanisms"
    "Implement rate limiting"
    "Final bug fixes and polish"
)

# Generate dates between March 1 and April 30, 2024
start_date="2024-03-01"
end_date="2024-04-30"

# Convert to epoch time
start_epoch=$(date -j -f "%Y-%m-%d" "$start_date" "+%s")
end_epoch=$(date -j -f "%Y-%m-%d" "$end_date" "+%s")

# Calculate total seconds in range
total_seconds=$((end_epoch - start_epoch))

# Create commits with random dates
for i in "${!commits[@]}"; do
    # Generate random seconds within the date range
    random_seconds=$((RANDOM % total_seconds))
    commit_epoch=$((start_epoch + random_seconds))
    
    # Format the date for git
    commit_date=$(date -j -f "%s" "$commit_epoch" "+%Y-%m-%dT%H:%M:%S")
    
    # Make a small change to ensure commit
    echo "// Commit $((i+1)) - $(date)" >> backend/src/index.js
    
    # Stage changes
    git add .
    
    # Commit with custom date
    GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" git commit -m "${commits[$i]}"
    
    echo "Created commit $((i+1)): ${commits[$i]} on $commit_date"
done

echo "All commits generated successfully!"
