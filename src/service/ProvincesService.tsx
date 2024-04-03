import { Demo } from './types/types';

export const ProvinceService = {
    getProvinces(countryCode) {
        const a = fetch("/demo/data/provinces.json", { headers: { "Cache-Control": "no-cache" } })
          .then((res) => res.json())
          .then((d) => d.data.fil as Demo.Province[])
          .then(value => value.filter(value1 => value1 === countryCode))
    }
};
