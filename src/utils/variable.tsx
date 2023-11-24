export const keyUser = 'm8nvn*&hKwcgb^D-D#Hz^5CXfKySpY';
export const keyToken = 'b7a2bdf4-ac40-4012-9635-ff4b7e55eae0';
export const keyRefreshToken = '15c665b7-592f-4b60-b31f-a252579a3bd0';
export const timeBuild = '0fc57d7b-0b51-41ef-8b7e-ed7b7d5dba16';
export const linkApi = import.meta.env.VITE_URL_API;
export const languages = import.meta.env.VITE_URL_LANGUAGES.split(',');
export const language = import.meta.env.VITE_URL_LANGUAGE;
// export const urlChat = import.meta.env.REACT_APP_URL_CHAT;
// export const passChat = 'RL?N*&M%8+G=Q3$FgLbQdD7A4d3PNj';
// export const firebaseConfig = {
//   apiKey: import.meta.env.REACT_APP_API_KEY_FIREBASE,
//   authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN_FIREBASE,
//   projectId: import.meta.env.REACT_APP_PROJECT_ID_FIREBASE,
//   storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET_FIREBASE,
//   messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID_FIREBASE,
//   appId: import.meta.env.REACT_APP_APP_ID_FIREBASE
// };
export const listType = [
  { value: 'type1', label: 'Type 1' },
  { value: 'type2', label: 'Type 2' },
  { value: 'type3', label: 'Type 3' },
];
export enum keyRole {
  P_AUTH_DELETE_IMAGE_TEMP = '11cc566b-b109-49f8-983f-84ff08f9849e',

  P_CODE_TYPE_LISTED = '2a71d57d-7c2d-49ad-a7e9-3cd4aace132f',
  P_CODE_TYPE_DETAIL = '7af26c77-e81f-4875-89df-9d4c2fa3ce52',
  P_CODE_TYPE_CREATE = '45f014c0-9ebe-497e-9766-2054ebb7e1d5',
  P_CODE_TYPE_UPDATE = 'fdb47b79-1a6e-49be-8f5b-8525a547534a',
  P_CODE_TYPE_DELETE = 'f16e2bc7-12b9-446e-b53b-a2597ca0ad3a',

  P_CODE_LISTED = '5d808d76-bf99-4a51-b4b6-d5aa37bdb398',
  P_CODE_DETAIL = 'eb510a79-4f75-4b14-a118-f036c1daa430',
  P_CODE_CREATE = 'a9574d5e-269d-44f9-a5bb-41cf06d7bdda',
  P_CODE_UPDATE = '6d34b679-9c0e-489a-a2de-a17e37fadf72',
  P_CODE_DELETE = 'e21ac25b-1651-443e-9834-e593789807c9',

  P_USER_ROLE_LISTED = '8f559613-ef55-4ef0-8068-8c37e84b75de',
  P_USER_ROLE_DETAIL = '35ea86b5-e591-4819-9c41-4d35ed580d0b',
  P_USER_ROLE_CREATE = 'f6732943-cb1d-484b-8644-7740a295e3e3',
  P_USER_ROLE_UPDATE = '3e8aa2c2-35bf-4a56-8bf2-8f8de240e24c',
  P_USER_ROLE_DELETE = '62fd3bc2-0921-4113-9b5b-9966dd5a0517',

  P_USER_LISTED = 'ac0c4f13-776d-4b71-be4d-f9952734a319',
  P_USER_DETAIL = 'a9de3f3d-4c04-4f50-9d1b-c3c2e2eca6dc',
  P_USER_CREATE = '41c9d4e1-ba5a-4850-ad52-35ac928a61d9',
  P_USER_UPDATE = 'bc0b5f32-ddf7-4c61-b435-384fc5ac7574',
  P_USER_DELETE = 'b82e6224-12c3-4e6c-b4e0-62495fb799bf',

  P_DATA_TYPE_LISTED = '2712ca04-7e7c-44b6-83c1-b8c7f332a0fb',
  P_DATA_TYPE_CREATE = '03380c3a-3336-42f4-b8c2-e54084d35655',
  P_DATA_TYPE_UPDATE = '00e77095-35ea-4755-bbae-46a1ba78e46e',
  P_DATA_TYPE_DELETE = '0e481286-bd5d-4203-a374-a8f8f8735f33',

  P_DATA_LISTED = '1db70aa0-7541-4433-b2f6-fbd7bf8bf7bb',
  P_DATA_CREATE = 'c3ab9e11-7ba3-4afd-b5cb-c560362a3144',
  P_DATA_UPDATE = '99ea12da-5800-4d6d-9e73-60c016a267a9',
  P_DATA_DELETE = '2e8c8772-2505-4683-b6fa-13fa2570eee7',

  P_PARAMETER_LISTED = 'd278abcb-1956-4b45-95c1-2ab612110ec6',
  P_PARAMETER_CREATE = 'd9185449-e2ac-4e72-9c9f-25788c23d5ba',
  P_PARAMETER_UPDATE = '3d478437-949b-4ae7-9c21-79cabb1663a3',
  P_PARAMETER_DELETE = '275ebda7-3e03-4c93-b352-baa7705528aa',

  P_POST_LISTED = '7c34dc92-cbbe-4419-8dbc-745818d76098',
  P_POST_CREATE = '0ca9634c-3496-4059-bf86-5bec23c96b55',
  P_POST_UPDATE = 'eda2799a-4072-46a7-9a26-efa9a98036db',
  P_POST_DELETE = '4097d5ff-e35c-4bff-a5b1-013ca1181762',

  P_POST_TYPE_LISTED = 'efa34c52-8c9a-444d-a82b-8bec109dbab5',
  P_POST_TYPE_CREATE = '87cb77c4-565c-43ec-bffc-fbaf5077c2be',
  P_POST_TYPE_UPDATE = 'bfa36cef-71c4-4f08-89e6-d7e0c1c03ba4',
  P_POST_TYPE_DELETE = 'cd00c62e-1ec4-4c61-b273-cdd6867a3212',

  P_DAYOFF_LISTED = '80668128-7e1d-46ef-95d1-bb4cff742f61',
  P_DAYOFF_DETAIL = 'bd11ca07-2cf4-473f-ac43-50b0eac577f3',
  P_DAYOFF_CREATE = 'becacb61-46c5-445e-bce4-0f3a2cfed519',
  P_DAYOFF_UPDATE = '972e4159-e3ce-416e-a526-ffd83039e09a',
  P_DAYOFF_DELETE = 'cdece61b-f159-4dec-8b27-b7de50c9b849',
  P_DAYOFF_UPDATE_STATUS = '3431f438-20fd-4482-b2e1-ad7f89c67eed',
  P_DAYOFF_EXPORT_EXCEL = 'a4f0f84c-2f4d-46ed-99c9-e928b53d9d54',

  P_USER_TEAM_LISTED = '894a30a1-3998-4a31-a02d-76ff8e9e8479',
  P_USER_TEAM_DETAIL = '3c140e6d-eb76-4595-9780-151cfa7501d6',
  P_USER_TEAM_CREATE = 'aa1da8b6-e2b6-4e50-b7e1-713e0565c50c',
  P_USER_TEAM_UPDATE = '8cbfcd72-746d-4d40-bef2-034520769b43',
  P_USER_TEAM_DELETE = 'a3988171-8aaa-4925-9a8b-8e3190d92fd4',

  P_BOOKING_LISTED = '941f5380-cfde-4bdf-9400-c6b3964c82ce',
  P_BOOKING_DETAIL = '50267915-c98b-46a8-a310-ffa9f0aa00d3',
  P_BOOKING_CREATE = '5416d154-4c0a-498f-8f0f-d941543db082',
  P_BOOKING_UPDATE = '8f2ff690-32a1-4d9a-a4a0-91e5f934c71b',
  P_BOOKING_DELETE = '8c93d8f8-7db8-4a4c-a5e6-1cb0f53cc684',

  P_QUESTION_LISTED = '80668128-7e1d-46ef-95d1-bb4cff742f31',
  P_QUESTION_DETAIL = 'bd11ca07-2cf4-473f-ac43-50b0eac57732',
  P_QUESTION_CREATE = 'becacb61-46c5-445e-bce4-0f3a2cfed533',
  P_QUESTION_UPDATE = '972e4159-e3ce-416e-a526-ffd83039e034',
  P_QUESTION_DELETE = 'cdece61b-f159-4dec-8b27-b7de50c9b835',
}
