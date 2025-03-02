#!/bin/bash

# Get the first commit hash (oldest)
FIRST_COMMIT=$(git rev-list --max-parents=0 HEAD)

# Start interactive rebase from the first commit
git rebase -i $FIRST_COMMIT

# Create a script to update dates during rebase
cat > /tmp/update_commit_date.sh << 'EOF'
#!/bin/bash
# This script will be called for each commit during rebase
# Update the commit date from 2024 to 2025
NEW_DATE=$(echo "$GIT_COMMITTER_DATE" | sed "s/2024/2025/")
export GIT_COMMITTER_DATE="$NEW_DATE"
export GIT_AUTHOR_DATE="$NEW_DATE"
EOF

chmod +x /tmp/update_commit_date.sh
