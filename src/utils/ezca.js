import request from './request'
import { Message } from 'element-ui'
/* eslint-disable */
const ezcaurl = 'http://localhost:9997/'
//var	ezcaurl = "https://localhost:9998/";

function EZCAisIe() {
  return 'ActiveXObject' in window
}

function EZCAAjaxIO(json) {
  let xmlhttp
  if (xmlhttp == null) {
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest()
    } // code for IE6, IE5
    else {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
  }
  json = encodeURIComponent(json)
  xmlhttp.open('POST', ezcaurl, false)
  xmlhttp.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded;charset=UTF-8',
  )
  xmlhttp.send('json=' + json)
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    return xmlhttp.responseText
  } else {
    return ''
  }
}

function EZCAezca() {
  let json = null;
  this.GetVersion = function() {
    json = '{"function":"Version"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }
  this.InitSKF = function(SKFList, ConrNameList) {
    json =
      '{"function":"InitSKF_SOF","SKFList":"' +
      SKFList +
      '","ConrNameList":"' +
      ConrNameList +
      '"}'
    var rev = EZCAAjaxIO(json)

    return rev
  }

  this.SOF_GetUserList = function() {
    json = '{"function":"SOF_GetUserList"}'
    var rev = EZCAAjaxIO(json)

    return rev
  }

  this.GetKeySn = function(CertID) {
    json = '{"function":"GetKeySn_SOF","CertID":"' + CertID + '"}'
    var rev = EZCAAjaxIO(json)

    return rev
  }

  this.SOF_ExportUserCert = function(CertID) {
    json = '{"function":"SOF_ExportUserCert","CertID":"' + CertID + '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_Login = function(CertID, PassWd) {
    json =
      '{"function":"SOF_Login","CertID":"' +
      CertID +
      '","PassWd":"' +
      PassWd +
      '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_ChangePassWd = function(CertID, OldPassWd, NewPassWd) {
    json =
      '{"function":"SOF_ChangePassWd","CertID":"' +
      CertID +
      '","OldPassWd":"' +
      OldPassWd +
      '","NewPassWd":"' +
      NewPassWd +
      '"}'
    var rev = EZCAAjaxIO(json) + ''
    if (rev == 'TRUE') {
      return true
    } else {
      return false
    }
  }

  this.SOF_ExportExChangeUserCert = function(CertID) {
    json = '{"function":"SOF_ExportExChangeUserCert","CertID":"' + CertID + '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_GetCertInfo = function(Cert, Type) {
    json =
      '{"function":"SOF_GetCertInfo","Cert":"' + Cert + '","Type":' + Type + '}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_GetCertInfoByOid = function(Cert, Oid) {
    json =
      '{"function":"SOF_GetCertInfoByOid","Cert":"' +
      Cert +
      '","Oid":"' +
      Oid +
      '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_GetUserInfo = function(CertID, Type) {
    json =
      '{"function":"SOF_GetUserInfo","CertID":"' +
      CertID +
      '","Type":' +
      Type +
      '}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_ValidateCert = function(Cert) {
    json = '{"function":"SOF_ValidateCert","Cert":"' + Cert + '"}'
    var rev = EZCAAjaxIO(json) + ''
    if (rev == 'TRUE') {
      return true
    } else {
      return false
    }
  }

  this.SOF_SignData = function(CertID, InData) {
    json =
      '{"function":"SOF_SignData","CertID":"' +
      CertID +
      '","InData":"' +
      InData +
      '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_PubKeyEncrypt = function(Cert, InData) {
    json =
      '{"function":"SOF_PubKeyEncrypt","Cert":"' +
      Cert +
      '","InData":"' +
      InData +
      '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_PriKeyDecrypt = function(CertID, InData) {
    json =
      '{"function":"SOF_PriKeyDecrypt","CertID":"' +
      CertID +
      '","InData":"' +
      InData +
      '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_SignDataByP7 = function(CertID, InData) {
    json =
      '{"function":"SOF_SignDataByP7","CertID":"' +
      CertID +
      '","InData":"' +
      InData +
      '"}'
    var rev = EZCAAjaxIO(json)
    return rev
  }

  this.SOF_GetP7SignDataInfo = function(P7Data, Type) {
    json =
      '{"function":"SOF_GetP7SignDataInfo","P7Data":"' +
      P7Data +
      '","Type":' +
      Type +
      '}'
    var rev = EZCAAjaxIO(json)
    return rev
  }


  /**
   * 电子签名验证
   */
  this.SOF_Verify = function(obj){
    //1.获取certid
    let certid = this.SOF_GetUserList().split('||')[1]
    if(certid){
        let code = btoa(encodeURI(obj))
        //2.生成签名原文
        let signData = `base64:=?utf-8?encodeURI?=${code}?=`

        //3.PIN码验证
        this.SOF_SignDataByP7(certid,signData)

        //4.生成p1签名值
        let signP1 = this.SOF_SignData(certid,signData)
        //5.获取签名证书序列号
        let certNum = this.SOF_GetCertInfo(this.SOF_ExportUserCert(certid),2)

        request({
            url: '/api/v1/ca/signCheck',
            method: 'post',
            params:{
                signData,
                signP1,
                certNum
            },
        }).then(res=>{
            Message({
                message: "电子签名验证成功",
                type: 'success',
                showClose: true,
                duration: 3000
            })
        }).catch(err=>{
            Message({
                message: "电子签名验证失败",
                type: 'error',
                showClose: true,
                duration: 3000
            })
        })
    }else{
        Message({
            message: "请插入U盾",
            type: 'error',
            showClose: true,
            duration: 3000
        })
    }
  }
}

let ezca = null;

if (!EZCAisIe()) {
  ezca = new EZCAezca()
}

export default ezca
