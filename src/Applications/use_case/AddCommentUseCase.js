/* AddCommentUseCase.js */
const NewComment = require('../../Domains/comments/entities/NewComment.js');

class AddCommentUseCase{
    // memberikan nilai awal pada saat suatu objek dibuat dengan 
    // menggunakan constructor
    constructor({
        commentRepository // objek
    }){
        this._commentRepository = commentRepository; // representasi objek
    }

    async execute(useCasePayload){
        const newComment = new NewComment({ content: useCasePayload.content }); // menciptakan objek baru dengan nama newComment
        return this._commentRepository // mengembalikan nilai dari objek
            .addComment(newComment, useCasePayload.threadId, useCasePayload.owner); // fungsi addComment digunakan untuk menambahkan comment
                                                                                    // ke dalam database berdasarkan parameternya.
    }
}

module.exports = AddCommentUseCase;