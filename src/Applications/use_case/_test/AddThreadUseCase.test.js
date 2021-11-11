const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // arange
        const useCasePayload = {
            title : 'dicoding',
            body  : 'secret',
            owner : 'user-123',
        };
        const expectedAddedThread = new AddedThread({
            id    : 'thread-123',
            title : useCasePayload.title,
            owner : useCasePayload.owner,
        });

        /* creating depedency of use case*/
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread));

        /* creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        //action 
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        //asset
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
            title : useCasePayload.title,
            body : useCasePayload.body,
        }), useCasePayload.owner);    
    });
});