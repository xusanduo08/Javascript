// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';

export default function (api: IApi, options) {

  // Example: output the webpack config
  api.onBuildSuccess(({stats}) => {
    console.log(stats);
  })


}
