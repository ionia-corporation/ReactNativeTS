import { StyleSheet, ViewStyle, TextStyle, Dimensions, ImageStyle, Platform } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const paragraph = {
  paddingTop: 10,
  paddingBottom: 10
} as TextStyle;

const loginSocialButton = {
  alignSelf: 'center',
  paddingLeft: 25,
  paddingRight: 25,
  marginTop: 15
} as ViewStyle

export const Colors = {
  white: '#ffffff',
  gray: '#555555',
  neonRed: '#fb0240',
  lightGray: '#9c9c9c',
  middleGray: '#323232',
  darkGray: '#2e2e2e',
  claret: '#6c001b',
  black: '#101010',
  warmGrey: '#7c7c7c',
  offGray: '#434343',
  facebook: '#293e6a',
  google: '#2e5cab'
};

export const Styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  } as ViewStyle,

  viewContainer: {
    backgroundColor: Colors.middleGray
  } as ViewStyle,

  button: {
    alignSelf: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    backgroundColor: Colors.neonRed
  } as ViewStyle,

  modal: {
    backgroundColor: Colors.neonRed,
    height: '100%'
  } as ViewStyle,

  modalCloseButton: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignSelf: 'flex-end'
  } as ViewStyle,

  modalCloseIcon: {
    fontSize: 25,
    color: Colors.claret
  } as TextStyle,

  modalButton: {
    alignSelf: 'center',
    backgroundColor: Colors.claret,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  } as ViewStyle,

  switch: {
    transform: Platform.OS === 'ios' ? [{scaleX: .8}, {scaleY: .8}] : []
  } as ViewStyle,

  loadingContent: {
    justifyContent: 'center',
    flex: 1
  } as ViewStyle,

  loadingImage: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    resizeMode: 'contain',
    opacity: .4
  } as ImageStyle,

  loginHeader: {
    backgroundColor: Colors.neonRed,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50
  } as ImageStyle,

  loginHeaderImage: {
    flex: 1,
    width: 100,
    height: 100,
    resizeMode: 'contain'
  } as ImageStyle,

  loginHeaderTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 15,
    backgroundColor: 'transparent'
  } as TextStyle,

  loginSignUpText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  } as ViewStyle,

  loginSignUpLink: {
    paddingLeft: 5,
    paddingTop: 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 2
  } as ViewStyle,

  loginSocialButton,

  loginFacebookButton: {
    ...loginSocialButton,
    backgroundColor: Colors.facebook
  } as ViewStyle,

  loginGoogleButton: {
    ...loginSocialButton,
    backgroundColor: Colors.google,
    paddingRight: 35
  } as ViewStyle,

  loginSocialIcon: {
    fontSize: 20,
    color: Colors.white
  } as TextStyle,

  loginSocialText: {
  } as TextStyle,

  signupContent: {
    // marginTop: 20
  } as ViewStyle,

  signupSuccessful: {
    marginTop: 50
  } as ViewStyle,

  header: {
    backgroundColor: Colors.neonRed,
    borderBottomWidth: 0
  } as ViewStyle,

  headerBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  } as ViewStyle,

  headerSide: {
    display: 'flex',
    flex: 0,
    minWidth: '10%'
  } as ViewStyle,

  headerTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: Colors.white
  } as TextStyle,

  headerIcon: {
    fontSize: 25,
    color: Colors.black,
    paddingLeft: 10,
    paddingRight: 10
  } as TextStyle,

  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  } as TextStyle,

  logo: {
    marginBottom: 50,
  } as ImageStyle,

  subtitle: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  } as TextStyle,

  input: {
    backgroundColor: 'rgba(200, 200, 200, 0.4)',
    height: 40,
    paddingLeft: 45,
    borderRadius: 20,
    color: '#333333',
  },

  inputWrapper: {
    width: DEVICE_WIDTH,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  } as ViewStyle,

  listItem: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 0,
    padding: 20,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1
  } as ViewStyle,

  listItemStatus: {
    color: Colors.lightGray,
    borderRadius: 50,
    backgroundColor: Colors.offGray,
    marginTop: 2,
    marginRight: 13,
    padding: 12
  } as TextStyle,

  listItemStatusOn: {
    color: Colors.white,
    backgroundColor: Colors.neonRed
  } as TextStyle,

  listItemTitle: {
    color: Colors.white,
    margin: 0,
    width: '100%',
    fontSize: 20
  } as TextStyle,

  listItemSubtitle: {
    color: Colors.warmGrey,
    margin: 0,
    width: '100%'
  } as TextStyle,

  listItemGroup: {
    flexDirection: 'column',
    backgroundColor: Colors.black
  } as ViewStyle,

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 5,
  } as TextStyle,

  sectionDescription: {
    paddingTop: 5,
    paddingLeft: 5,
  } as TextStyle,

  sectionStatus: {
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    color: '#333333',
  } as TextStyle,

  link: {
    color: Colors.neonRed,
    paddingLeft: 0,
    paddingRight: 0
  } as TextStyle,

  paragraph,

  errorMessage: {
    fontSize: 13,
    fontWeight: 'bold'
  } as TextStyle,

  errorContainer: {
    borderRadius: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    padding: 5,
    paddingTop: 18
  } as ViewStyle,

  footerTab: {
    backgroundColor: '#131313'
  } as ViewStyle,

  addBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.claret,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 12
  } as ViewStyle,

  addBarButton: {
    paddingLeft: 5
  } as ViewStyle,

  addBarIcon: {
    fontSize: 25,
    color: Colors.neonRed
  } as TextStyle,

  addBarText: {
    color: Colors.neonRed,
    marginLeft: -7,
    fontSize: 15
  } as TextStyle,

  form: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column'
  } as ViewStyle,

  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  } as ViewStyle,

  formItem: {
    marginLeft: 0,
    height: 58
  } as TextStyle,

  formLabel: {
    fontSize: 20
  } as TextStyle,

  formInput: {
    color: Colors.white,
    fontSize: 20,
    paddingBottom: 0,
    paddingTop: 0
  } as TextStyle,

  formInputPass: {
    width: '80%'
  } as TextStyle,

  formButton: {
    alignSelf: 'center',
    paddingLeft: 70,
    paddingRight: 70,
    marginTop: 10
  } as ViewStyle,

  formParagraph: {
    ...paragraph,
    color: Colors.lightGray
  } as TextStyle,

  formInputLink: {
    position: 'absolute',
    right: 0,
    bottom: 12,
    color: Colors.warmGrey,
    fontWeight: 'bold',
    fontSize: 14
  } as TextStyle,

  switchContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  } as ViewStyle,

  switchText: {
    color: Colors.lightGray
  } as TextStyle,

  accountHeader: {
    backgroundColor: Colors.neonRed,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30
  } as ViewStyle,

  accountIconContainer: {
    borderWidth: 3,
    borderColor: Colors.white,
    borderRadius: 80,
    width: 160,
    height: 160,
    backgroundColor: Colors.offGray,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: -30
  } as ViewStyle,

  accountUserIcon: {
    fontSize: 200,
    backgroundColor: 'transparent',
    color: Colors.darkGray,
    marginTop: -10
  } as TextStyle
});

export default Styles;
