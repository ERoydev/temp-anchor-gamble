# Introduction
- This document specifies the common issues when you try to test and work with `renderers-dart`

## The 'pnpm installs multiple versions of one package' problem

`pnpm why @codama/visitors-core`
Shows the real source of version conflict
```
dependencies:
@codama/renderers-core 1.0.17
└── @codama/visitors-core 1.3.1
@codama/renderers-js 1.3.1
├─┬ @codama/renderers-core 1.0.16
│ └── @codama/visitors-core 1.3.0
└── @codama/visitors-core 1.3.0
@codama/renderers-rust 1.1.1
├─┬ @codama/renderers-core 1.0.16
│ └── @codama/visitors-core 1.3.0
└── @codama/visitors-core 1.3.0
@codama/visitors 1.3.1
└── @codama/visitors-core 1.3.1
@codama/visitors-core 1.3.1
codama 1.3.1
├─┬ @codama/validators 1.3.1
│ └── @codama/visitors-core 1.3.1
└─┬ @codama/visitors 1.3.1
  └── @codama/visitors-core 1.3.1

```

As you can see some packages (like @codama/renderers-js), depend on `@codama/visitors-core@1.3.0`, while others use `1.3.1`.
This is why pnpm installs both versions. And i receive error when i try to `pnpm generate:client`

Temporary Solution:
- Just delete the problematic versions from the `error logs` manually from the node_modules.
- In my case was `node-types` and `visitors-core` both with @1.3.0 version to be deleted.