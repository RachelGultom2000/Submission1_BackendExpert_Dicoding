const NewComment = require('../../Domains/comments/entities/NewComment.js');


class AddCommentUseCase{
    constructor({
        commentRepository
    }){
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload){
        const newComment = NewComment({ content: useCasePayload.content });
        return this._commentRepository
            .addComment(newComment, useCasePayload.threadId, useCasePayload.owner);
    }
}

module.exports = AddCommentUseCase;