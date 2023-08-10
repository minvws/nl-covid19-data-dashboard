import sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { initializeFeatureFlaggedData } from '../initialize-feature-flagged-data';
// Importing these files like this because of how sinon implements stub and replace
import * as featureFlagConstants from '../feature-flag-constants';
import * as load from '~/static-props/utils/load-json-from-file';

const InitializeFeatureFlaggedData = suite('initializeFeatureFlaggedData');

InitializeFeatureFlaggedData.after.each(() => {
  sinon.restore();
});

InitializeFeatureFlaggedData("should add an empty array to a GM_COLLECTION if it doesn't exist", () => {
  sinon.replace(featureFlagConstants, 'disabledMetrics', [
    {
      name: 'test',
      isEnabled: false,
      dataScopes: ['gm_collection'],
      metricName: 'testCollection',
    },
  ]);

  sinon.stub(load, 'loadJsonFromFile').callsFake((...args) => {
    const pathStr = args[0] as string;
    if (pathStr.endsWith('__index.json')) {
      return gmCollectionSchema;
    }
    if (pathStr.endsWith('testCollection.json')) {
      return gmCollectionTestCollectionSchema;
    }
  });

  const gmCollection: any = {
    last_generated: '1630502291',
    proto_name: 'GM_COLLECTION',
    name: 'GM_COLLECTION',
    code: 'GM_COLLECTION',
  };

  initializeFeatureFlaggedData(gmCollection, 'gm_collection');

  assert.ok(gmCollection.testCollection);
  assert.equal(gmCollection.testCollection.length, 0);
});

InitializeFeatureFlaggedData('should do nothing if the specified metric name on GM_COLLECTION already exists', () => {
  sinon.replace(featureFlagConstants, 'disabledMetrics', [
    {
      name: 'test',
      isEnabled: false,
      dataScopes: ['gm_collection'],
      metricName: 'testCollection',
    },
  ]);

  sinon.stub(load, 'loadJsonFromFile').callsFake((...args) => {
    const pathStr = args[0] as string;
    if (pathStr.endsWith('__index.json')) {
      return gmCollectionSchema;
    }
    if (pathStr.endsWith('testCollection.json')) {
      return gmCollectionTestCollectionSchema;
    }
  });

  const initialValues = [{ test: true }, { test: true }];
  const testValues = JSON.parse(JSON.stringify(initialValues));

  const gmCollection: any = {
    last_generated: '1630502291',
    proto_name: 'GM_COLLECTION',
    name: 'GM_COLLECTION',
    code: 'GM_COLLECTION',
    testCollection: initialValues,
  };

  initializeFeatureFlaggedData(gmCollection, 'gm_collection');

  assert.equal(gmCollection.testCollection, testValues);
});

InitializeFeatureFlaggedData("should add an empty metric to a GM if it doesn't exist", () => {
  sinon.replace(featureFlagConstants, 'disabledMetrics', [
    {
      name: 'test',
      isEnabled: false,
      dataScopes: ['gm'],
      metricName: 'testCollection',
    },
  ]);

  sinon.stub(load, 'loadJsonFromFile').callsFake((...args) => {
    const pathStr = args[0] as string;
    if (pathStr.endsWith('__index.json')) {
      return gmSchema;
    }
    if (pathStr.endsWith('testCollection.json')) {
      return gmTestCollectionSchema;
    }
  });

  const gm: any = {
    last_generated: '1630502291',
    proto_name: 'GM001',
    name: 'GM001',
    code: 'GM001',
  };

  initializeFeatureFlaggedData(gm, 'gm');

  assert.ok(gm.testCollection);
  assert.ok(gm.testCollection.values);
  assert.equal(gm.testCollection.values.length, 0);
  assert.equal(gm.testCollection.last_value, {
    date_start_unix: 0,
    date_end_unix: 0,
    average: 0,
    total_number_of_samples: 0,
    sampled_installation_count: 0,
    total_installation_count: 0,
    date_of_insertion_unix: 0,
  });
});

InitializeFeatureFlaggedData('should do nothing if the specified metric on GM already exists', () => {
  sinon.replace(featureFlagConstants, 'disabledMetrics', [
    {
      name: 'test',
      isEnabled: false,
      dataScopes: ['gm'],
      metricName: 'testCollection',
    },
  ]);

  sinon.stub(load, 'loadJsonFromFile').callsFake((...args) => {
    const pathStr = args[0] as string;
    if (pathStr.endsWith('__index.json')) {
      return gmSchema;
    }
    if (pathStr.endsWith('testCollection.json')) {
      return gmTestCollectionSchema;
    }
  });

  const initialValues = {
    values: [{ test: true }, { test: true }],
    last_value: { test: true },
  };
  const testValues = JSON.parse(JSON.stringify(initialValues));

  const gm: any = {
    last_generated: '1630502291',
    proto_name: 'GM001',
    name: 'GM001',
    code: 'GM001',
    testCollection: initialValues,
  };

  initializeFeatureFlaggedData(gm, 'gm');

  assert.equal(gm.testCollection, testValues);
});

InitializeFeatureFlaggedData('should init the metric properties on a VR_COLLECTION metric if they do not exist', () => {
  sinon.replace(featureFlagConstants, 'disabledMetrics', [
    {
      name: 'test',
      isEnabled: false,
      dataScopes: ['archived_vr_collection'],
      metricName: 'testCollection',
      metricProperties: ['test1', 'test2'],
    },
  ]);

  sinon.stub(load, 'loadJsonFromFile').callsFake((...args) => {
    const pathStr = args[0] as string;
    if (pathStr.endsWith('__index.json')) {
      return vrCollectionSchema;
    }
    if (pathStr.endsWith('testCollection.json')) {
      return vrCollectionTestCollectionSchema;
    }
  });

  const vrCollection: any = {
    last_generated: '1630502291',
    proto_name: 'VR_COLLECTION',
    name: 'VR_COLLECTION',
    code: 'VR_COLLECTION',
    testCollection: [{ test3: 'test' }, { test3: 'test' }, { test3: 'test' }],
  };

  initializeFeatureFlaggedData(vrCollection, 'archived_vr_collection');

  assert.ok(vrCollection.testCollection);
  assert.equal(vrCollection.testCollection.length, 3);
  assert.equal(vrCollection.testCollection[0], {
    test1: 0,
    test2: true,
    test3: 'test',
  });
  assert.equal(vrCollection.testCollection[1], {
    test1: 0,
    test2: true,
    test3: 'test',
  });
  assert.equal(vrCollection.testCollection[2], {
    test1: 0,
    test2: true,
    test3: 'test',
  });
});

InitializeFeatureFlaggedData('should do nothing if the specified metric properties already exist in the VR_COLLECTION items', () => {
  sinon.replace(featureFlagConstants, 'disabledMetrics', [
    {
      name: 'test',
      isEnabled: false,
      dataScopes: ['archived_vr_collection'],
      metricName: 'testCollection',
      metricProperties: ['test1', 'test2'],
    },
  ]);

  sinon.stub(load, 'loadJsonFromFile').callsFake((...args) => {
    const pathStr = args[0] as string;
    if (pathStr.endsWith('__index.json')) {
      return vrCollectionSchema;
    }
    if (pathStr.endsWith('testCollection.json')) {
      return vrCollectionTestCollectionSchema;
    }
  });

  const initialValues = [
    { test1: 100, test2: false, test3: 'test' },
    { test1: 200, test2: true, test3: 'test' },
    { test1: 300, test2: false, test3: 'test' },
  ];

  const testValues = JSON.parse(JSON.stringify(initialValues));

  const vrCollection: any = {
    last_generated: '1630502291',
    proto_name: 'VR_COLLECTION',
    name: 'VR_COLLECTION',
    code: 'VR_COLLECTION',
    testCollection: initialValues,
  };

  initializeFeatureFlaggedData(vrCollection, 'archived_vr_collection');

  assert.equal(vrCollection.testCollection, testValues);
});

InitializeFeatureFlaggedData("should initialize the enum properties on a VR_COLLECTION metric if they don't exist", () => {
  sinon.replace(featureFlagConstants, 'disabledMetrics', [
    {
      name: 'test',
      isEnabled: false,
      dataScopes: ['archived_vr_collection'],
      metricName: 'testCollection',
      metricProperties: ['test1', 'test2'],
    },
  ]);

  sinon.stub(load, 'loadJsonFromFile').callsFake((...args) => {
    const pathStr = args[0] as string;
    if (pathStr.endsWith('__index.json')) {
      return vrCollectionSchema;
    }
    if (pathStr.endsWith('testCollection.json')) {
      return vrCollectionTestCollectionEnumSchema;
    }
  });

  const vrCollection: any = {
    last_generated: '1630502291',
    proto_name: 'VR_COLLECTION',
    name: 'VR_COLLECTION',
    code: 'VR_COLLECTION',
    testCollection: [{ test3: 'test' }, { test3: 'test' }, { test3: 'test' }],
  };

  initializeFeatureFlaggedData(vrCollection, 'archived_vr_collection');

  assert.ok(vrCollection.testCollection);
  assert.equal(vrCollection.testCollection.length, 3);
  assert.equal(vrCollection.testCollection[0], {
    test1: 'enum1',
    test2: true,
    test3: 'test',
  });
  assert.equal(vrCollection.testCollection[1], {
    test1: 'enum1',
    test2: true,
    test3: 'test',
  });
  assert.equal(vrCollection.testCollection[2], {
    test1: 'enum1',
    test2: true,
    test3: 'test',
  });
});

InitializeFeatureFlaggedData.run();

/**
 * data: should add an empty array to a GM_COLLECTION if it doesn't exist
 */
const gmCollectionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'gm_collection',
  additionalProperties: false,
  required: ['testCollection'],
  properties: {
    testCollection: {
      type: 'array',
      maxItems: 344,
      items: {
        $ref: 'testCollection.json',
      },
    },
  },
};
const gmCollectionTestCollectionSchema = {};
// ###########################################################

/**
 * data: should add an empty metric to a GM if it doesn't exist
 */
const gmSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'gm001',
  additionalProperties: false,
  required: ['testCollection'],
  properties: {
    testCollection: {
      $ref: 'testCollection.json',
    },
  },
};
const gmTestCollectionSchema = {
  definitions: {
    value: {
      title: 'gm_sewer_value',
      type: 'object',
      additionalProperties: false,
      required: ['date_start_unix', 'date_end_unix', 'average', 'total_number_of_samples', 'sampled_installation_count', 'total_installation_count', 'date_of_insertion_unix'],
      properties: {
        date_start_unix: {
          type: 'integer',
        },
        date_end_unix: {
          type: 'integer',
        },
        average: {
          type: 'number',
        },
        total_number_of_samples: {
          type: 'integer',
        },
        sampled_installation_count: {
          type: 'integer',
        },
        total_installation_count: {
          type: 'integer',
        },
        date_of_insertion_unix: {
          type: 'integer',
        },
      },
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'gm_sewer',
  type: 'object',
  required: ['values', 'last_value'],
  additionalProperties: false,
  properties: {
    values: {
      type: 'array',
      items: {
        $ref: '#/definitions/value',
      },
    },
    last_value: {
      $ref: '#/definitions/value',
    },
  },
};
// ###########################################################

/**
 * data: should add an empty array to a GM_COLLECTION if it doesn't exist
 */
const vrCollectionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'vr_collection',
  additionalProperties: false,
  required: ['testCollection'],
  properties: {
    testCollection: {
      type: 'array',
      maxItems: 344,
      items: {
        $ref: 'testCollection.json',
      },
    },
  },
};
const vrCollectionTestCollectionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'gm_collection_test_collection',
  additionalProperties: false,
  required: ['test1', 'test2', 'test3'],
  properties: {
    test1: {
      type: 'integer',
    },
    test2: {
      type: 'boolean',
    },
    test3: {
      type: 'string',
    },
  },
};
const vrCollectionTestCollectionEnumSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'gm_collection_test_collection',
  additionalProperties: false,
  required: ['test1', 'test2', 'test3'],
  properties: {
    test1: {
      enum: ['enum1', 'enum2', 'enum3'],
    },
    test2: {
      type: 'boolean',
    },
    test3: {
      type: 'string',
    },
  },
};
// ###########################################################
