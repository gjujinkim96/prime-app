const http = require('http');

function handleError(res, baseURL) {
	res.writeHead(400);
	res.end(`need url in format: ${baseURL}/?input=number`);
}

function handleOutOfRange(res) {
	res.writeHead(400);
	res.end('number x must be 0 <= x <= 1000000');
}

function getLargestPrimeFactor(n) {
	if (n == 0 || n == 1) {
		return n;
	}

	let largestPrime = -1;
	while (n % 2 == 0) {
		largestPrime = 2;
		n = Math.floor(n/2);
	}

	for (let i = 3; i <= 1000000; i += 2) {
		if (n == 1) {
			break;
		}

		while (n % i == 0) {
			largestPrime = i;
			n = Math.floor(n/i);
		}
	}

	return largestPrime;
}

const requestListener = function (req, res) {
	const baseURL = `http://${req.headers.host}`;
	const myURL = new URL(req.url, baseURL);
	let nStr = myURL.searchParams.get('input');
	if (nStr) {
		let n = parseInt(nStr);
		if (isNaN(n)) {
			handleError(res, baseURL);
			return;
		}

		if (n < 0 || 1000000 < n) {
			handleOutOfRange(res);
			return;
		}

		let largestPrime = getLargestPrimeFactor(n);
		console.log(`Got ${nStr}, returned ${largestPrime}`);
		res.writeHead(200);
		res.end(largestPrime.toString());
	} else {
		handleError(res, baseURL);
		return;
	}
}

const server = http.createServer(requestListener);
server.listen(8080);