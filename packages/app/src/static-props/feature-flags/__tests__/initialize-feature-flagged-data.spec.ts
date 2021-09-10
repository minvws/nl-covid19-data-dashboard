import { Feature } from '@corona-dashboard/common';
import { initializeFeatureFlaggedData } from '../initialize-feature-flagged-data';

const featureFlagConstantsMock = require('~/static-props/feature-flags/feature-flag-constants');

const loadJsonFromFileMock = require('~/static-props/utils/load-json-from-file');
const loadJsonFromFileSpy = jest.spyOn(
  loadJsonFromFileMock,
  'loadJsonFromFile'
);

describe('initializeFeatureFlaggedData', () => {
  beforeEach(() => {
    loadJsonFromFileSpy.mockReset();
  });

  it("should add an empty array to a GM_COLLECTION if it doesn't exist", () => {
    featureFlagConstantsMock.disabledMetrics = [
      {
        name: 'test',
        isEnabled: false,
        dataScopes: ['gm_collection'],
        metricName: 'testCollection',
      },
    ];

    const gmCollection: any = {
      last_generated: '1630502291',
      proto_name: 'GM_COLLECTION',
      name: 'GM_COLLECTION',
      code: 'GM_COLLECTION',
    };

    loadJsonFromFileSpy.mockImplementation((...args) => {
      const pathStr = args[0] as string;
      if (pathStr.endsWith('__index.json')) {
        return gmCollectionSchema;
      }
      if (pathStr.endsWith('testCollection')) {
        return gmCollectionTestCollectionSchema;
      }
    });

    initializeFeatureFlaggedData(gmCollection, 'gm_collection');

    expect(gmCollection.testCollection).toBeDefined();
    expect(gmCollection.testCollection.length).toEqual(0);
  });

  it('should do nothing if the specified metric name on GM_COLLECTION already exists', () => {
    featureFlagConstantsMock.disabledMetrics = [
      {
        name: 'test',
        isEnabled: false,
        dataScopes: ['gm_collection'],
        metricName: 'testCollection',
      },
    ];

    const initialValues = [{ test: true }, { test: true }];
    const testValues = JSON.parse(JSON.stringify(initialValues));

    const gmCollection: any = {
      last_generated: '1630502291',
      proto_name: 'GM_COLLECTION',
      name: 'GM_COLLECTION',
      code: 'GM_COLLECTION',
      testCollection: initialValues,
    };

    loadJsonFromFileSpy.mockImplementation((...args) => {
      const pathStr = args[0] as string;
      if (pathStr.endsWith('__index.json')) {
        return gmCollectionSchema;
      }
      if (pathStr.endsWith('testCollection')) {
        return gmCollectionTestCollectionSchema;
      }
    });

    initializeFeatureFlaggedData(gmCollection, 'gm_collection');

    expect(gmCollection.testCollection).toEqual(testValues);
  });

  it("should add an empty metric to a GM if it doesn't exist", () => {
    featureFlagConstantsMock.disabledMetrics = [
      {
        name: 'test',
        isEnabled: false,
        dataScopes: ['gm'],
        metricName: 'testCollection',
      },
    ];

    const gm: any = {
      last_generated: '1630502291',
      proto_name: 'GM001',
      name: 'GM001',
      code: 'GM001',
    };

    loadJsonFromFileSpy.mockImplementation((...args) => {
      const pathStr = args[0] as string;

      if (pathStr.endsWith('__index.json')) {
        return gmSchema;
      }

      if (pathStr.endsWith('testCollection')) {
        return gmTestCollectionSchema;
      }
    });

    initializeFeatureFlaggedData(gm, 'gm');

    expect(gm.testCollection).toBeDefined();
    expect(gm.testCollection.values).toBeDefined();
    expect(gm.testCollection.values.length).toEqual(0);
    expect(gm.testCollection.last_value).toEqual({
      date_start_unix: 0,
      date_end_unix: 0,
      average: 0,
      total_number_of_samples: 0,
      sampled_installation_count: 0,
      total_installation_count: 0,
      date_of_insertion_unix: 0,
    });
  });

  it('should do nothing if the specified metric on GM already exists', () => {
    featureFlagConstantsMock.disabledMetrics = [
      {
        name: 'test',
        isEnabled: false,
        dataScopes: ['gm'],
        metricName: 'testCollection',
      },
    ];

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

    loadJsonFromFileSpy.mockImplementation((...args) => {
      const pathStr = args[0] as string;

      if (pathStr.endsWith('__index.json')) {
        return gmSchema;
      }

      if (pathStr.endsWith('testCollection')) {
        return gmTestCollectionSchema;
      }
    });

    initializeFeatureFlaggedData(gm, 'gm');

    expect(gm.testCollection).toEqual(testValues);
  });

  it("should initialize the metric properties on a VR_COLLECTION metric if they don't exist", () => {
    featureFlagConstantsMock.disabledMetrics = [
      {
        name: 'test',
        isEnabled: false,
        dataScopes: ['vr_collection'],
        metricName: 'testCollection',
        metricProperties: ['test1', 'test2'],
      },
    ] as Feature[];

    const vrCollection: any = {
      last_generated: '1630502291',
      proto_name: 'VR_COLLECTION',
      name: 'VR_COLLECTION',
      code: 'VR_COLLECTION',
      testCollection: [{ test3: 'test' }, { test3: 'test' }, { test3: 'test' }],
    };

    loadJsonFromFileSpy.mockImplementation((...args) => {
      const pathStr = args[0] as string;
      if (pathStr.endsWith('__index.json')) {
        return vrCollectionSchema;
      }
      if (pathStr.endsWith('testCollection')) {
        return vrCollectionTestCollectionSchema;
      }
    });

    initializeFeatureFlaggedData(vrCollection, 'vr_collection');

    expect(vrCollection.testCollection).toBeDefined();
    expect(vrCollection.testCollection.length).toEqual(3);
    expect(vrCollection.testCollection[0]).toEqual({
      test1: 0,
      test2: true,
      test3: 'test',
    });
    expect(vrCollection.testCollection[1]).toEqual({
      test1: 0,
      test2: true,
      test3: 'test',
    });
    expect(vrCollection.testCollection[2]).toEqual({
      test1: 0,
      test2: true,
      test3: 'test',
    });
  });

  it('should do nothing if the specified metric properties already exist in the VR_COLLECTION items', () => {
    featureFlagConstantsMock.disabledMetrics = [
      {
        name: 'test',
        isEnabled: false,
        dataScopes: ['vr_collection'],
        metricName: 'testCollection',
        metricProperties: ['test1', 'test2'],
      },
    ] as Feature[];

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

    loadJsonFromFileSpy.mockImplementation((...args) => {
      const pathStr = args[0] as string;
      if (pathStr.endsWith('__index.json')) {
        return vrCollectionSchema;
      }
      if (pathStr.endsWith('testCollection')) {
        return vrCollectionTestCollectionSchema;
      }
    });

    initializeFeatureFlaggedData(vrCollection, 'vr_collection');

    expect(vrCollection.testCollection).toEqual(testValues);
  });

  it("should initialize the enum properties on a VR_COLLECTION metric if they don't exist", () => {
    featureFlagConstantsMock.disabledMetrics = [
      {
        name: 'test',
        isEnabled: false,
        dataScopes: ['vr_collection'],
        metricName: 'testCollection',
        metricProperties: ['test1', 'test2'],
      },
    ] as Feature[];

    const vrCollection: any = {
      last_generated: '1630502291',
      proto_name: 'VR_COLLECTION',
      name: 'VR_COLLECTION',
      code: 'VR_COLLECTION',
      testCollection: [{ test3: 'test' }, { test3: 'test' }, { test3: 'test' }],
    };

    loadJsonFromFileSpy.mockImplementation((...args) => {
      const pathStr = args[0] as string;
      if (pathStr.endsWith('__index.json')) {
        return vrCollectionSchema;
      }
      if (pathStr.endsWith('testCollection')) {
        return vrCollectionTestCollectionEnumSchema;
      }
    });

    initializeFeatureFlaggedData(vrCollection, 'vr_collection');

    expect(vrCollection.testCollection).toBeDefined();
    expect(vrCollection.testCollection.length).toEqual(3);
    expect(vrCollection.testCollection[0]).toEqual({
      test1: 'enum1',
      test2: true,
      test3: 'test',
    });
    expect(vrCollection.testCollection[1]).toEqual({
      test1: 'enum1',
      test2: true,
      test3: 'test',
    });
    expect(vrCollection.testCollection[2]).toEqual({
      test1: 'enum1',
      test2: true,
      test3: 'test',
    });
  });
});

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
      maxItems: 355,
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
      required: [
        'date_start_unix',
        'date_end_unix',
        'average',
        'total_number_of_samples',
        'sampled_installation_count',
        'total_installation_count',
        'date_of_insertion_unix',
      ],
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
      maxItems: 355,
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
