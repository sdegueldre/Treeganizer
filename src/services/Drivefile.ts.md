# DriveFiles.ts

DriveFiles.ts is a small typescript file that makes interacting with the google
drive API easier. It uses the drive.appdata scope so it can only create and read
application data

# Usage

    import DriveFiles.ts;
    const drive = new DriveFiles(clientId, apiKey);
    await drive.signIn();
    const files = drive.list({spaces: 'appDataFolder'});
    const newFile = (await drive.create({parents: ['appDataFolder'], name: 'filename'})).result;
    drive.save(fileId, content);