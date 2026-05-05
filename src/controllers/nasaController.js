const NASA_API_KEY = process.env.NASA_API_KEY;

const fetchNasaData = async (url, params = {}) => {
    const urlObj = new URL(url);
    urlObj.searchParams.append('api_key', NASA_API_KEY);
    Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]));

    const response = await fetch(urlObj.toString());
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `NASA API error: ${response.status}`);
    }
    return await response.json();
};

exports.getApod = async (req, res) => {
    try {
        const data = await fetchNasaData('https://api.nasa.gov/planetary/apod');
        res.json({ data, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: 'ExternalAPIError', message: error.message });
    }
};

exports.getWeather = async (req, res) => {
    try {
        const data = await fetchNasaData('https://api.nasa.gov/insight_weather/', { feedtype: 'json', ver: '1.0' });
        res.json({ data, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: 'ExternalAPIError', message: error.message });
    }
};

exports.getExoplanets = async (req, res) => {
    try {
        const query = 'select+pl_name,hostname,discoverymethod,disc_year+from+ps+where+tran_flag=1+and+default_flag=1+order+by+pl_name';
        const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${query}&format=json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch exoplanets');
        const data = await response.json();
        res.json({ data, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: 'ExternalAPIError', message: error.message });
    }
};

exports.getEarth = async (req, res) => {
    try {
        const data = await fetchNasaData('https://api.nasa.gov/EPIC/api/natural');
        res.json({ data, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: 'ExternalAPIError', message: error.message });
    }
};

exports.getAsteroids = async (req, res) => {
    try {
        const data = await fetchNasaData('https://api.nasa.gov/neo/rest/v1/feed/today', { detailed: false });
        res.json({ data, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: 'ExternalAPIError', message: error.message });
    }
};

exports.getTech = async (req, res) => {
    try {
        const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
        const dateStr = '2026-05-01';

        // 1. Fetch project list (Try without Bearer token first, just api_key)
        const listUrl = `https://techport.nasa.gov/api/projects?updatedSince=${dateStr}&api_key=${NASA_API_KEY}`;
        console.log(`[TechPort] Fetching list: ${listUrl}`);

        const listResponse = await fetch(listUrl, {
            headers: { 'Accept': 'application/json' }
        });
        
        console.log(`[TechPort] List Status: ${listResponse.status}`);
        
        if (!listResponse.ok) {
            const errorText = await listResponse.text();
            throw new Error(`TechPort List Error (${listResponse.status}): ${errorText}`);
        }

        const listData = await listResponse.json();
        const projects = listData.projects || [];
        const totalCount = listData.totalCount || projects.length;
        
        console.log(`[TechPort] Found ${projects.length} projects in list`);

        // 2. Fetch details (limiting to first 10)
        const detailedProjects = [];
        const limit = 10;
        const projectsToFetch = projects.slice(0, limit);

        for (const p of projectsToFetch) {
            const id = p.projectId || p.id;
            if (!id) continue;

            try {
                const detailUrl = `https://techport.nasa.gov/api/projects/${id}?api_key=${NASA_API_KEY}`;
                const detailResponse = await fetch(detailUrl, {
                    headers: { 'Accept': 'application/json' }
                });

                if (detailResponse.ok) {
                    const detailData = await detailResponse.json();
                    detailedProjects.push(detailData.project);
                } else {
                    console.warn(`[TechPort] Failed to fetch details for ${id}: ${detailResponse.status}`);
                    detailedProjects.push({
                        id: id,
                        title: `Project ${id} (Details unavailable)`,
                        lastUpdated: p.lastUpdated,
                        statusDescription: 'Limited info'
                    });
                }
            } catch (err) {
                console.error(`[TechPort] Error in detail loop for ${id}:`, err.message);
            }
        }

        res.json({ 
            data: {
                projects: detailedProjects,
                totalFound: totalCount,
                showing: detailedProjects.length
            }, 
            error: null 
        });
    } catch (error) {
        console.error('[TechPort] Controller Final Error:', error.message);
        res.status(500).json({ data: null, error: 'ExternalAPIError', message: error.message });
    }
};
