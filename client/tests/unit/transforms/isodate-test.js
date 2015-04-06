import {
  describeModule,
  it
} from 'ember-mocha';
/* global moment */

//just a random datetime in UTC
var UTC_STRING = "2015-01-10T12:05:00.000Z";

describeModule('transform:isodate', 'IsodateTransform', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
}, function() {
  it('should serialize datetimes', function() {
    var transform = this.subject();

    var serialized = transform.serialize(moment(UTC_STRING));

    equal(serialized, UTC_STRING);
  });

  it('should deserialize datetimes', function() {
    var transform = this.subject();

    var deserialized = transform.deserialize(UTC_STRING);

    deserialized.utc();

    equal(deserialized.year(), 2015);
    equal(deserialized.month(), 0);
    equal(deserialized.date(), 10);
    equal(deserialized.hour(), 12);
    equal(deserialized.minute(), 05);
    equal(deserialized.second(), 0);

  });
});
