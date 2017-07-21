export interface Journey {
  journeyId: string;
  departureDateTime: Date;
  arrivalDateTime: Date;
  duration: string;
  price: number;
  origin: {
    cityName: string;
    cityId: string;
    stopName: string;
    stopId: string;
  };
  destination: {
    cityName: string;
    cityId: string;
    stopName: string;
    stopId: string;
  };
  legs: JourneyLeg[];
  reservableType: string;
  serviceInformation: string;
  promotionCodeStatus: string;
  cheapestPrice: boolean;
  routeName: string;
  lowStockCount: number;
}

export interface JourneyLeg {
  carrier: string;
  transportTypeId: number;
  departureDateTime: Date;
  arrivalDateTime: Date;
  duration: string;
  origin: {
    cityName: string;
    cityId: string;
    stopName: string;
    stopId: string;
  };
  destination: {
    cityName: string;
    cityId: string;
    stopName: string;
    stopId: string;
  };
  carrierIcon: string;
}
