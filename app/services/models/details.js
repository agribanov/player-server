module.exports = {
    title: '',
    subtitle: '',
    year: 0000,
    genre: '',
    quality: '',
    imageUrl: '',
    length: '',
    description: '',
    foldersKey: ''
}
/*
    //Optional folders:[]

If `folders` does not exist meanf client should request them by /collection/folders/:serviceCode/?:videoId&:foldersKey'

If `folders` exits should contain array of objects
    {
        title,
        id
        files - optional
    }
If `files` does not exist mean client should request them by /collection/files/:serviceCode/?:videoId&:foldersKey:folderId'

*/