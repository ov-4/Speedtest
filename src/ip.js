async function handleRequest(request) {
  const ip = request.headers.get('cf-connecting-ip') || 'Unknown IP';
  
  const colo = (request.cf && request.cf.colo) || 'Unknown Colo';
  const cfCountry = (request.cf && request.cf.country) || '';
  const cfCity = (request.cf && request.cf.city) || '';

  const asn = (request.cf && request.cf.asn) || '';
  const asOrganization = (request.cf && request.cf.asOrganization) || '';
  const visitorCountry = (request.cf && request.cf.country) || '';
  const visitorRegion = (request.cf && request.cf.region) || '';
  const visitorCity = (request.cf && request.cf.city) || '';
  const continent = (request.cf && request.cf.continent) || '';

  const loc = cfCity ? `${cfCity}, ${cfCountry}` : cfCountry;
  const processedString = `${ip} (connected to ${colo}, ${loc})`;

  const res = new Response(JSON.stringify({
    processedString: processedString,
    rawIspInfo: "",
    visitorInfo: {
      ip: ip,
      asn: asn ? parseInt(asn) : null,
      isp: asOrganization || 'Unknown ISP',
      country: visitorCountry,
      region: visitorRegion,
      city: visitorCity,
      continent: continent
    },
    cfInfo: {
      colo: colo,
      country: cfCountry,
      city: cfCity
    }
  }));

  res.headers.set('access-control-allow-origin', '*');
  res.headers.set('content-type', 'application/json;charset=UTF-8');

  return res;
}

module.exports = handleRequest;
