const multer = require('multer');
const upload = require('../../../helpers/fileUpload');

describe('Upload middleware', () => {
    describe('filename function', () => {
        it('should generate filename with userId when authenticated', () => {
            const req = { userId: '12345' };
            const file = { originalname: 'photo.jpg' };
            const cb = jest.fn();

            const storage = multer.diskStorage({
                filename: (req, file, cb) => {
                    if (!req.userId) return cb(new Error('User not authenticated'));
                    cb(null, '12345-123456789-photo.jpg');
                }
            });

            storage.getFilename(req, file, cb);
            expect(cb).toHaveBeenCalledWith(null, expect.stringContaining('12345'));
        });

        it('should return error when userId missing', () => {
            const req = {};
            const file = { originalname: 'photo.jpg' };
            const cb = jest.fn();

            const storage = multer.diskStorage({
                filename: (req, file, cb) => {
                    if (!req.userId) return cb(new Error('User not authenticated'));
                }
            });

            storage.getFilename(req, file, cb);
            expect(cb).toHaveBeenCalledWith(new Error('User not authenticated'));
        });
    });

    describe('fileFilter', () => {
        it('should accept valid image types', () => {
            const cb = jest.fn();
            const file = { mimetype: 'image/jpeg', originalname: 'photo.jpg' };
            
            upload.fileFilter(null, file, cb);
            expect(cb).toHaveBeenCalledWith(null, true);
        });

        it('should reject invalid file types', () => {
            const cb = jest.fn();
            const file = { mimetype: 'text/plain', originalname: 'file.txt' };
            
            upload.fileFilter(null, file, cb);
            expect(cb).toHaveBeenCalledWith(new Error('Error: Images only!'));
        });
    });

    describe('limits', () => {
        it('should have 5MB file size limit', () => {
            expect(upload.limits.fileSize).toBe(5 * 1024 * 1024);
        });
    });
});