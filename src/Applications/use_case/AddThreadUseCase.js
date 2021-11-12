const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase { 
    // memberikan nilai awal pada saat suatu objek dibuat dengan 
    // menggunakan constructor
    constructor({ threadRepository }){
        this._threadRepository = threadRepository; // representasi objek
    }

    async execute(useCasePayload){
        // menciptakan objek baru dengan nama newThread yang berisi parameter dari si tabel thread
        const newThread = new NewThread({title: useCasePayload.title, body: useCasePayload.body}); 
        // console.log(newThread,useCasePayload.owner);
        return this._threadRepository.addThread(newThread,useCasePayload.owner); // kembalikan nilai dari objek
    }
}

module.exports = AddThreadUseCase;