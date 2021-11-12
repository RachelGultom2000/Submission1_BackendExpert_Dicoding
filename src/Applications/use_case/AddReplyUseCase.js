const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase{
    // memberikan nilai awal pada saat suatu objek dibuat dengan 
    // menggunakan constructor
    constructor({ replyRepository}){
        this._replyRepository = replyRepository; // representasi objek
    }

    async execute(useCasePayload){
        // parameter berisi id dari tabel yang berelasi
        const{
            content,
            threadId,
            commentId,
            owner,
        } = useCasePayload;
        const newReply = new NewReply({ content }); // menciptakan objek baru dengan nama newReply
        return this._replyRepository // mengembalikan nilai dari objek;
            .addReply(newReply, threadId, commentId,owner); // fungsi addReply digunakan untuk menambahkan reply atau balasan
                                                            // ke dalam database berdasarkan parameter di dalam const;
    }
}

module.exports = AddReplyUseCase;