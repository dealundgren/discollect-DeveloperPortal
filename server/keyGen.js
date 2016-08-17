module.exports = keyGenerator = () => {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
	let key = '';
	for (let i=0; i<32; i++) {
		key += chars[Math.floor(Math.random() * chars.length)];
	}
	return key;
}
