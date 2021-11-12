class PerformLikeUseCase {
     // memberikan nilai awal pada saat suatu objek ibuat dengan 
    // menggunakan constructor
    constructor({ likeRepository }){
        this._likeRepository = likeRepository; // representasi objek
    }

    async execute(useCasePayload){
        // deklarasikan const untuk menampung parameter
        const{
            threadId,
            commentId,
            owner,
        } = useCasePayload;

        // tangkap data dari ketiga parameter diatas.
        const likesDetail = await this._likeRepository.getLikeDetail(threadId,commentId,owner);
        if(likesDetail.length){
            return this._likeRepository.removeLike(likesDetail[0].id); // kembalikan nilai dari objek _likeRepository yang dihapus
        }
        return this._likeRepository
            .addLike(threadId, commentId, owner); // kembalikan nilai dari objek _likeRepository
    }
}

module.exports = PerformLikeUseCase;