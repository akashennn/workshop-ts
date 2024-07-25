const log = console.log;

let apt = {
  floor: 12,
  number: "12B",
  size: 3400,
  bedRooms: 3.4,
  bathRooms: 2,
  Price: 400000,
  amenities: {
    airCon: 4,
  },
};

// override the floor property to be read-only
Object.defineProperty(apt, "floor", {
  writable: false,
});

// override the floor property to be read-only
Object.defineProperty(apt, "floor", {
  enumerable: false,
});

// override the floor property to be non-configurable
Object.defineProperty(apt, "floor", {
  configurable: false,
});

const descriptor = Object.getOwnPropertyDescriptor(apt, "floor");

// before overridden: { value: 12, writable: true, enumerable: true, configurable: true }
// after overridden: { value: 12, writable: false, enumerable: true, configurable: true }
log(descriptor);

// before overridden: [ 'number', 'size', 'bedRooms', 'bathRooms', 'Price', 'amenities', 'floor' ]
// after overridden: [ 'number', 'size', 'bedRooms', 'bathRooms', 'Price', 'amenities' ]
log(Object.keys(apt));

// will throw an error, because we have disabled configurability
// Object.defineProperty(apt, "floor", {
//   writable: true,
// });

log(apt.floor);
