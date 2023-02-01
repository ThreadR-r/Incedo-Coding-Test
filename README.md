# Incedo Services GmbH Backend Challenge

## Description

For this project, I have made choices when it comes to libraries:
- ExpressJS: powerful and popular application web framework for NodeJS.
- csv-stringify: this library allows to stringify JS dictionaries to CSV.
- dotenv: manage different .env according to the environment.
- express-rate-limit: allows to simply limit repeated requests to prevent abuse.
- cors

For development:
- mocha and supertest: test frameworks.

For documentation:
- JSDoc

## Documentation

An simple HTML documentation is available in the `./doc/` folder.

To generate the doc again, execute the next command at the project's root:
```shell
yarn doc
```

## Improvement possibilities:

- A better management of error exceptions, returning an error code for instances, when the LastFM API is not available, or when the CSV File already exists.
- A Prometheus monitoring implementation to monitor the health of the application and track some metrics like Saturation, Response Time, Error Rate and I/O Wait (important in this API).
- Replace CSV Files with a database to prevent I/O Wait of disks.
- Add a cache to handle repetitive and recent requests.
- And probably more.

## Installation (Production)

This API has a docker version.

### Unix

- Make sure you have `Yarn/NPM` and `NodeJS` installed

The commands below clone this repository and install production dependencies

```shell
git clone https://github.com/ThreadR-r/Incedo-Coding-Test
cd Incedo-Coding-Test/

# install only prod dependencies
# Yarn
yarn install --production=true --frozen-lockfile

# NPM
npm install --omit=dev
```

To run the API, execute the following command:
```shell
# Yarn
yarn start-prod

# NPM
npm run start-prod
```

### Docker (preferred)

#### Build the image

To build the docker image, after cloning this repo, go to the project's root and execute the following command:

```shell
docker build -t threadr/icedo-api:latest -f docker/Dockerfile .
```

#### Running the image
```shell
docker run --rm -it --init --name icedo-api-artists-search -p "25581:8080" -v "${PWD}/api_csv_output:/incedo_api/output" threadr/icedo-api
```
The API is exposed over the HTTP port `8080` and the CSV output files are generated in `/incedo_api/output` container's folder.

### Configuration

Some parameters let you configure the API through environment variables as described below:

| PARAMETER | DEFAULT VALUE | DESCRIPTION|
|-|-|-|
| PORT | 8080 | The HTTP Port where the API is listening to |
| HOSTNAME | 127.0.0.1 | The hostname where the API is listening to |
| LASTFM_API_KEY | PERSONAL API KEY | The LastFM API Key to access the **artist.search** endpoint (my personal API key is included in this specific project) |
| ARTISTS_SEARCH_RESULTS_OUTPUT_DIR | ./output/ | The output directory where the CSV files will be generated. |
| ARTISTS_SEARCH_OVERRIDE_FILE | false | Decides whether or not CSV files should be override if they already exist (default to false for "security" reasons)  |

#### Example
Running with a personnal LastFM API key
```shell
docker run --rm -it --init --name icedo-api-artists-search -p "25581:8080" -v "${PWD}/api_csv_output:/incedo_api/output" -e LASTFM_API_KEY="my_personal_key" threadr/icedo-api
```

## Development

To create the development environment, execute the following commands:
```shell
git clone https://github.com/ThreadR-r/Incedo-Coding-Test
cd Incedo-Coding-Test/

# install only prod dependencies
# Yarn
yarn install

# NPM
npm install
```

To run the API in development mode, execute the following command:
```shell
# Yarn
yarn start

# NPM
npm run start
```

## Test

Simple test units are implemented in order to test the API endpoint and be ready for CI/CD.
After the preparation of the development environment, run the following command to test the API.

```shell
# Yarn
yarn test

# NPM
npm run test
```