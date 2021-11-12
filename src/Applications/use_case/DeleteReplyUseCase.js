class DeleteReplyUseCase{
    // memberikan nilai awal pada saat suatu objek ibuat dengan 
    // menggunakan constructor
    constructor({ replyRepository}){
        this._replyRepository = replyRepository; //representasi objek
    }

    async execute(useCasePayload){
        // deklarasikan variabel const yang berisi parameter.
        const {
            replyId,
            credentialId,
        } = useCasePayload;
        // await bertujuan untuk menunda pekerjaan dari si async hingga proses await berhasil
        // lebih dulu dieksekusi.
        await this._replyRepository.verifyReplyAccess(replyId, credentialId);
        // kembalikan nilai objek dari _replyRepository
        return this._replyRepository
            .deleteReplyByReplyId(replyId);
    }
}

module.exports = DeleteReplyUseCase;