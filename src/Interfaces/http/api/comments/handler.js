class CommentHandler {
    constructor({
        addCommentUseCase, deleteCommentUseCase
    }){
        this._addCommentUseCase = addCommentUseCase;
        this._deleteCommentUseCase = deleteCommentUseCase;

        this._postCommentHandler = this.postCommentHandler;
        this._deleteCommentHandler = this.deleteCommentHandler;
    }

    async postCommentHandler(request,h){
        const useCasePayload = {
            threadId: request.params.threadId,
            content: request.params.content,
            owner: request.params.credentials.id,
        };
        const addedComment = await this._addCommentUseCase.execute(useCasePayload);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request,h){
        const useCasePayload = {
            threadId: request.params.threadId,
            commentId: request.params.commentId,
            credentialId: request.params.credentials.id,
        };
        await this._deleteCommentUseCase.execute(useCasePayload);
        const res = h.response({
            status : 'success',
        });
        res.code(200);
        return res;
    }
}

module.exports = CommentHandler;