import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SocialService } from '../social.service';
import { User } from '../../models/user.model';
import { Friendship } from '../../models/friendship.model';

describe('SocialService', () => {
    let socialService: SocialService;

    beforeEach(() => {
        socialService = new SocialService();
        jest.clearAllMocks();
    });

    const createUser = async (clerkId: string, name: string) => {
        return await User.create({
            clerkId,
            fullName: name,
            email: `${name}@test.com`,
            imageUrl: 'img.jpg'
        });
    };

    describe('Friend Request Flow', () => {
        it('should send a friend request', async () => {
            await createUser('user1', 'User One');
            await createUser('user2', 'User Two');

            const friendship = await socialService.sendFriendRequest('user1', 'user2');

            expect(friendship).toBeDefined();
            expect(friendship.status).toBe('pending');
            expect(friendship.initiator).toBe('user1');
        });

        it('should cancel a friend request', async () => {
            await createUser('user1', 'User One');
            await createUser('user2', 'User Two');

            // Send request directly via service or DB
            const friendship = await socialService.sendFriendRequest('user1', 'user2');

            // Cancel
            await socialService.cancelFriendRequest((friendship as any)._id.toString(), 'user1');

            // Verify
            const deleted = await Friendship.findById((friendship as any)._id);
            expect(deleted).toBeNull();
        });

        it('should accept a friend request', async () => {
            await createUser('user1', 'User One');
            await createUser('user2', 'User Two');

            const friendship = await socialService.sendFriendRequest('user1', 'user2');

            const accepted = await socialService.acceptFriendRequest((friendship as any)._id.toString(), 'user2');

            expect(accepted.status).toBe('accepted');

            // Verify DB verify both users are friends?
            // The service method implementation logic for `acceptFriendRequest`:
            // It updates status to 'accepted'.
            // AND the service might or might not update User.friends array?
            // Checking social.service.ts: it seems to ONLY update Friendship status.
            // Wait, FriendService updated User.friends. SocialService?
            // Let's check source code again.
        });

        it('should throw if cancelling request from non-initiator', async () => {
            await createUser('user1', 'User One');
            await createUser('user2', 'User Two');
            const friendship = await socialService.sendFriendRequest('user1', 'user2');

            await expect(socialService.cancelFriendRequest((friendship as any)._id.toString(), 'user2'))
                .rejects.toThrow('Only the initiator can cancel this request');
        });
    });
});
