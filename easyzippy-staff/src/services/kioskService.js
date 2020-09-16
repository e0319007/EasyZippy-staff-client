const KEYS = {
    kiosks: 'kiosks', 
    kioskId: 'kioskId'
}

export function insertKiosk(data) {
    let kiosks=getAllKiosks();
    data['id'] = generateKioskId();
    kiosks.push(data);
    localStorage.setItem(KEYS.kiosks, JSON.stringify(kiosks))
}

export function generateKioskId() {
    if(localStorage.getItem(KEYS.kioskId) == null) 
        localStorage.setItem(KEYS.kioskId, '0')
    var id = parseInt(localStorage.getItem(KEYS.kioskId))
    localStorage.setItem(KEYS.kioskId, (++id).toString())
    return id; 
}

export function getAllKiosks() {
    if (localStorage.getItem(KEYS.kiosks) == null) 
        localStorage.setItem(KEYS.kiosks, JSON.stringify([]))
    let kiosks = JSON.parse(localStorage.getItem(KEYS.kiosks));
    return kiosks;
}