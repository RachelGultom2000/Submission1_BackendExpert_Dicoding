class DeleteCommentUseCase {
    // memberikan nilai awal pada saat suatu objek dibuat dengan 
    // menggunakan constructor
    constructor({commentRepository}){
        this._commentRepository = commentRepository; //representasi objek
    }

    async execute(useCasePayload){
        // deklarasikan variabel const yang menampung id dari tabel thread dan comment
        const {
            threadId,
            commentId,
            credentialId,
        } = useCasePayload;
        // await bertujuan untuk menunda pekerjaan dari si async hingga proses await berhasil
        // lebih dulu dieksekusi.
        await this._commentRepository.verifyCommentAccess(commentId, credentialId);
        // kembalikan nilai dari objek _commentRepository
        return this._commentRepository
            .deleteCommentByCommentId(commentId);
    }
}

module.exports = DeleteCommentUseCase;