class LikeHandler {
  constructor({ performLikeUseCase }) {
    this._performLikeUseCase = performLikeUseCase;
    this.performLikeHandler = this.performLikeHandler.bind(this);
  }

  // CREATE
  async performLikeHandler(request, h) {
    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth.credentials.id,
    };
    await this._performLikeUseCase.execute(useCasePayload);
    const response = h.response({ status: "success" });
    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
