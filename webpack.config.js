const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const DEVELOPMENT_MODE = "development";
const PRODUCTION_MODE = "production";

const buildModeSetter = BuildModeSetter({ devMode: true });

module.exports = {
  mode: buildModeSetter.getMode(),
  entry: {
    "react-vendors": ["react", "react-dom"],
    ...getEntries(buildModeSetter.getMode()),
  },
  output: {
    path: path.resolve(__dirname, "dist", "js"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.module.css$/i,
        use: ["style-loader"],
      },
      {
        test: /\.module.css$/i,

        loader: "css-loader",
        options: {
          modules: false,
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".tsx", ".ts", ".js"],
  },
};

function BuildModeSetter({ devMode, prodMode }) {
  let currentMode;

  if (devMode === true && (prodMode === false || prodMode === undefined)) {
    currentMode = DEVELOPMENT_MODE;
  } else if (
    prodMode === true &&
    (devMode === false || devMode === undefined)
  ) {
    currentMode = PRODUCTION_MODE;
  } else {
    currentMode = DEVELOPMENT_MODE;
    console.warn("mode is not valid, current mode will be development mode");
  }

  return {
    getMode: () => currentMode,
  };
}

function getEntries(mode = "development") {
  if (mode === DEVELOPMENT_MODE) {
    return {
      dev_swiper: {
        import: "src/App.tsx",
        filename: 'dev.swiper.bundle.js',
        dependOn: ["react-vendors"],

      },
    };
  } else {
    return {
      prod_swiper: {
        import: "src/App.tsx",
        filename: 'prod.swiper.bundle.js',
        dependOn: ["react-vendors"],

      },
    };
  }
}
