DROP TABLE IF EXISTS t_admin;
DROP TABLE IF EXISTS t_admin_account;
DROP TABLE IF EXISTS t_admin_cert;
DROP TABLE IF EXISTS t_admin_auth;
DROP TABLE IF EXISTS t_admin_role;
DROP TABLE IF EXISTS t_role;
DROP TABLE IF EXISTS tb_cube_config;
DROP TABLE IF EXISTS tb_backlog_task;
DROP TABLE IF EXISTS jit_common_crldown_config;
DROP TABLE IF EXISTS jit_common_crldown_url;
DROP TABLE IF EXISTS jit_common_ocsp;
DROP TABLE IF EXISTS jit_common_crlentity;
DROP TABLE IF EXISTS jit_common_cacert;
DROP TABLE IF EXISTS tb_log;
DROP TABLE IF EXISTS tb_log_backup;
DROP TABLE IF EXISTS tb_export_task;
DROP TABLE IF EXISTS tb_system_log;
DROP TABLE IF EXISTS tb_system_log_backup;
DROP TABLE IF EXISTS  aqs_admin_role;
DROP TABLE IF EXISTS  aqs_roles;

CREATE TABLE t_admin (
  ADMIN_ID varchar(32) NOT NULL COMMENT '主键id',
  NAME varchar(50) DEFAULT NULL COMMENT '姓名',
  PHONE varchar(20) DEFAULT NULL COMMENT '手机号',
  EMAIL varchar(50) DEFAULT NULL COMMENT '邮箱',
  STATUS varchar(1) NOT NULL DEFAULT '0' COMMENT '管理员状态   0：启用     1：停用',
  CREATE_OPERATOR varchar(32) DEFAULT NULL COMMENT '创建人id',
  CREATE_TIME bigint(20) DEFAULT NULL COMMENT '创建时间',
  LAST_OPERATOR varchar(32) DEFAULT NULL COMMENT '最后操作人id',
  LAST_TIME bigint(20) DEFAULT NULL COMMENT '最后操作时间',
  PRIMARY KEY (ADMIN_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE t_admin_account (
  ACCOUNT_ID VARCHAR(32) NOT NULL COMMENT '主键ID',
  ADMIN_ID VARCHAR(32) DEFAULT NULL COMMENT '管理员ID',
  ACCOUNT VARCHAR(50) DEFAULT NULL COMMENT '账号',
  PASSWORD VARCHAR(50) DEFAULT NULL COMMENT '密码',
  PASSWORDSTATUS VARCHAR(1) DEFAULT NULL COMMENT '密码修改状态  0：未修改 1：已修改',
  CREATE_OPERATOR VARCHAR(32) DEFAULT NULL COMMENT '录入人ID',
  CREATE_TIME bigint(20) DEFAULT NULL COMMENT '录入时间',
  LAST_OPERATOR varchar(255) DEFAULT NULL COMMENT '修改人ID',
  LAST_TIME bigint(20) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (ACCOUNT_ID)
) ENGINE=INNODB DEFAULT CHARSET=UTF8;
alter table t_admin_account add unique(ACCOUNT);

CREATE TABLE t_admin_cert (
  CERT_ID varchar(32) NOT NULL COMMENT '主键id',
  ADMIN_ID varchar(32) DEFAULT NULL COMMENT '管理员id',
  CERTENTITY longtext COMMENT '证书base64编码',
  SUBJECT varchar(255) DEFAULT NULL COMMENT '证书主题',
  ISSUER varchar(255) DEFAULT NULL COMMENT '证书颁发者',
  CERT_IDENTIFIER varchar(255) DEFAULT NULL,
  CREATE_OPERATOR varchar(32) DEFAULT NULL COMMENT '录入人id',
  CREATE_TIME bigint(20) DEFAULT NULL COMMENT '录入时间',
  LAST_OPERATOR varchar(32) DEFAULT NULL COMMENT '修改人id',
  LAST_TIME bigint(20) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (CERT_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
alter table t_admin_cert add unique(CERT_IDENTIFIER);

CREATE TABLE t_admin_auth (
  AUTH_ID varchar(32) NOT NULL COMMENT '主键id',
  ADMIN_ID varchar(32) DEFAULT NULL COMMENT '管理员id',
  PASSWORD varchar(64) DEFAULT NULL COMMENT '增强密码',
  STATUS int(2) DEFAULT '0' COMMENT '密码修改状态  0：未修改 1：已修改',
  PRIMARY KEY (AUTH_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE t_admin_role (
  ID varchar(32) NOT NULL COMMENT '主键id',
  ADMIN_ID varchar(32) DEFAULT NULL COMMENT '系统管理员id',
  ROLENAME varchar(32) DEFAULT NULL COMMENT '角色id',
  CREATE_OPERATOR varchar(32) DEFAULT NULL,
  CREATE_TIME bigint(20) DEFAULT NULL,
  LAST_OPERATOR varchar(32) DEFAULT NULL,
  LAST_TIME bigint(20) DEFAULT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE t_role (
  ROLE_ID varchar(32) NOT NULL COMMENT '主键id',
  NAME varchar(20) DEFAULT NULL COMMENT '角色名称',
  DESCRIPTION varchar(100) DEFAULT NULL COMMENT '角色描述',
  DISPLAY longblob,
  EDITOR longblob,
  DEFAULTROLE longblob,
  CREATE_OPERATOR varchar(32) DEFAULT NULL COMMENT '创建人',
  CREATE_TIME bigint(20) DEFAULT NULL COMMENT '创建时间',
  LAST_OPERATOR varchar(32) DEFAULT NULL,
  LAST_TIME bigint(20) DEFAULT NULL,
  PRIMARY KEY (ROLE_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE tb_cube_config (
  ID int(11) NOT NULL AUTO_INCREMENT,
  SERVICE_ID varchar(64) DEFAULT NULL,
  NAME varchar(100) DEFAULT NULL,
  VALUE longtext,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

CREATE TABLE tb_backlog_task (
  TASKID varchar(32) NOT NULL COMMENT '任务主键id',
  TASKNAME varchar(30) DEFAULT NULL COMMENT '任务名称',
  TABLENAME varchar(30) DEFAULT NULL COMMENT '日志表-名称',
  TASKSTATUS varchar(1) DEFAULT NULL COMMENT '任务执行状态    0：执行中   1：闲置',
  TASKRESULT varchar(1) DEFAULT NULL COMMENT '任务上次执行结果   0：成功   1：失败',
  ERRORMSG text COMMENT '发生异常时的错误信息',
  STARTTIME datetime DEFAULT NULL COMMENT '（上次）开始执行时间',
  ENDTIME datetime DEFAULT NULL COMMENT '执行（上次）结束时间',
  NEXTFIRETIME datetime DEFAULT NULL COMMENT '任务下次执行时间',
  LOCALFILEDOWNLOADPATH varchar(500) DEFAULT NULL COMMENT '手动归档操作-本地归档类型-归档文件下载路径',
  CREATETIME datetime DEFAULT NULL COMMENT '任务创建时间',
  OPERATETIME datetime DEFAULT NULL COMMENT '任务操作时间',
  PRIMARY KEY (TASKID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE jit_common_cacert (
  id varchar(50) NOT NULL,
  name varchar(512) NOT NULL,
  rootcerttype varchar(30) NOT NULL,
  issuer varchar(512) NOT NULL,
  subject varchar(512) NOT NULL,
  notbefore datetime DEFAULT NULL,
  notafter datetime DEFAULT NULL,
  validity int(11) NOT NULL,
  superid varchar(50) NOT NULL,
  certverifydepth int(11) NOT NULL,
  checktype int(11) NOT NULL,
  subjectkeyidentifier varchar(100) DEFAULT NULL,
  certentity longblob,
  createby varchar(512) DEFAULT NULL,
  createtime datetime DEFAULT NULL,
  lastmodifytime datetime DEFAULT NULL,
  lastmodifyby varchar(512) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE jit_common_crldown_config (
  id varchar(50) NOT NULL,
  updatepolicy int(11) NOT NULL,
  updatetimetype char(1) DEFAULT NULL,
  timeinterval int(11) DEFAULT NULL,
  crlnexttime timestamp ,
  crltimeafter int(11),
  createby varchar(512) DEFAULT NULL,
  createtime timestamp,
  lastmodifytime timestamp,
  lastmodifyby varchar(512) DEFAULT NULL,
  ca_id varchar(50) NOT NULL,
  PRIMARY KEY (id),
  KEY ca_id (ca_id),
  CONSTRAINT jit_common_crldown_config_ibfk_1 FOREIGN KEY (ca_id) REFERENCES jit_common_cacert (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE jit_common_crlentity (
  id varchar(50) NOT NULL,
  crlfile longblob NOT NULL,
  issuer varchar(512) NOT NULL,
  startdate datetime NOT NULL,
  nextupdatedate datetime NOT NULL,
  signalgorithm varchar(50) NOT NULL,
  authoritykeyidentifier varchar(64) DEFAULT NULL,
  crlnumber int(11) DEFAULT NULL,
  crluniqueidentifier varchar(64) DEFAULT NULL,
  crltype int(11) NOT NULL,
  cacertid varchar(50) NOT NULL,
  downloadurl varchar(2048) DEFAULT NULL,
  downloadtype char(4) NOT NULL,
  createby varchar(512) DEFAULT NULL,
  createtime datetime DEFAULT NULL,
  lastmodifytime datetime DEFAULT NULL,
  lastmodifyby varchar(512) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
alter table jit_common_crlentity add unique(cacertid,crluniqueidentifier);

CREATE TABLE jit_common_crldown_url (
  id varchar(50) NOT NULL,
  downloadtype char(4) NOT NULL,
  ldapuserdn varchar(512) DEFAULT NULL,
  ldappassword varchar(64) DEFAULT NULL,
  url varchar(2048) NOT NULL,
  crltype int(11) NOT NULL,
  cacertid varchar(50) NOT NULL,
  createby varchar(512) DEFAULT NULL,
  createtime datetime DEFAULT NULL,
  lastmodifytime datetime DEFAULT NULL,
  lastmodifyby varchar(512) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY cacertid (cacertid),
  CONSTRAINT jit_common_crldown_url_ibfk_1 FOREIGN KEY (cacertid) REFERENCES jit_common_cacert (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE jit_common_ocsp (
  id varchar(50) NOT NULL,
  principaltype varchar(10) NOT NULL,
  principalurl varchar(2048) NOT NULL,
  subordinatetype varchar(10) DEFAULT NULL,
  subordinateurl varchar(2048) DEFAULT NULL,
  createby varchar(512) DEFAULT NULL,
  createtime timestamp ,
  lastmodifytime timestamp ,
  lastmodifyby varchar(512) DEFAULT NULL,
  ca_id varchar(50) NOT NULL,
  PRIMARY KEY (id),
  KEY ca_id (ca_id),
  CONSTRAINT jit_common_ocsp_ibfk_1 FOREIGN KEY (ca_id) REFERENCES jit_common_cacert (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE tb_log (
  log_id int(11) NOT NULL AUTO_INCREMENT,
  operator varchar(200) DEFAULT NULL,
  operator_ip varchar(50) DEFAULT NULL,
  create_time bigint(20) DEFAULT NULL COMMENT '存储使用年月日小时分秒毫秒 共17位数字',
  operat_content varchar(1000) DEFAULT NULL,
  operat_result varchar(1000) DEFAULT NULL,
  operat_data varchar(1000) DEFAULT NULL,
  server_sign varchar(2000) DEFAULT NULL,
  result varchar(50) DEFAULT NULL,
  client_sign longtext,
  PRIMARY KEY (log_id),
  KEY create_time (create_time)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

CREATE TABLE tb_log_backup (
  log_id int(11) NOT NULL AUTO_INCREMENT,
  operator varchar(200) DEFAULT NULL,
  operator_ip varchar(50) DEFAULT NULL,
  create_time bigint(20) DEFAULT NULL COMMENT '存储使用年月日小时分秒毫秒 共17位数字',
  operat_content varchar(1000) DEFAULT NULL,
  operat_result varchar(1000) DEFAULT NULL,
  operat_data varchar(1000) DEFAULT NULL,
  server_sign varchar(2000) DEFAULT NULL,
  result varchar(50) DEFAULT NULL,
  client_sign longtext,
  PRIMARY KEY (log_id),
  KEY create_time (create_time)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

CREATE TABLE tb_export_task (
  TASKID varchar(32) DEFAULT NULL COMMENT '主键id',
  TASKNAME varchar(30) DEFAULT NULL COMMENT '任务名称',
  TASKSTATUS varchar(1) DEFAULT NULL COMMENT '任务执行状态    0：执行中   1：闲置',
  TASKRESULT varchar(1) DEFAULT NULL COMMENT '任务上次执行结果   0：成功   1：失败',
  LOGTYPE varchar(32) DEFAULT NULL COMMENT '日志配置ID',
  STARTTIME datetime DEFAULT NULL COMMENT '（上次）开始执行时间',
  ENDTIME datetime DEFAULT NULL COMMENT '执行（上次）结束时间',
  ZIPFILEDOWNLOADPATH varchar(500) DEFAULT NULL COMMENT 'zip文件下载路径',
  ERRORINFO text COMMENT '错误信息',
  CREATETIME datetime DEFAULT NULL COMMENT '任务创建时间',
  OPERATETIME datetime DEFAULT NULL COMMENT '任务操作时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table  tb_system_log (
  log_id int not null auto_increment,
  create_time bigint(20) default null,
  operat_content varchar(100) default null,
  operat_data varchar(1000) default null,
  operat_result varchar(50) default null,
  primary key  (log_id),
  key create_time (create_time)
);
create table  tb_system_log_backup (
  log_id int not null auto_increment,
  create_time bigint(20) default null,
  operat_content varchar(100) default null,
  operat_data varchar(1000) default null,
  operat_result varchar(50) default null,
  primary key  (log_id),
  key create_time (create_time)
);



CREATE TABLE  aqs_roles  (
   role_id  varchar(50) NOT NULL,
   role_name  varchar(128) NOT NULL,
   role_desc  varchar(255) DEFAULT NULL,
   sign_server  varchar(256) DEFAULT NULL,
  PRIMARY KEY ( role_id ),
  KEY  roles_i1  ( role_name )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE  aqs_admin_role  (
   reqsn  varchar(40) NOT NULL,
   certsn  varchar(40) DEFAULT NULL,
   role_id  varchar(50) NOT NULL,
   audit_status  varchar(10) NOT NULL,
   sign_server  varchar(256) DEFAULT NULL,
  PRIMARY KEY ( reqsn , role_id , audit_status ),
  KEY  fk_admin_ro_reference_roles  ( role_id ),
  CONSTRAINT  fk_admin_ro_reference_roles  FOREIGN KEY ( role_id ) REFERENCES  aqs_roles  ( role_id )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS  aqs_pki_operator_info ;
CREATE TABLE  aqs_pki_operator_info  (
   id  varchar(40) NOT NULL,
   cert_dn  varchar(50) DEFAULT NULL COMMENT '证书主题',
   operator  varchar(40) DEFAULT NULL COMMENT '操作者',
   operator_ip  varchar(30) DEFAULT NULL COMMENT '操作者ip',
   result  varchar(30) NOT NULL COMMENT '操作结果',
   operator_type  varchar(30) DEFAULT NULL COMMENT '操作类型',
   operator_time  datetime DEFAULT NULL COMMENT '操作时间',
version  varchar(50) DEFAULT NULL COMMENT '日志版本，区分PKI1.0和2.0的日志',
   product_type  varchar(40) DEFAULT NULL COMMENT '产品类型（预留字段）',
  PRIMARY KEY ( id )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS  aqs_org_statis ;
CREATE TABLE  aqs_org_statis  (
   id  varchar(40) NOT NULL COMMENT 'id',
   org_id  varchar(40) DEFAULT NULL COMMENT '注册分中心id',
   org_cn  varchar(40) DEFAULT NULL COMMENT '注册分中心名称',
   create_time  datetime DEFAULT NULL COMMENT '创建时间',
   parent_id  varchar(40) DEFAULT NULL COMMENT '上级注册分中心id',
   statis_date  datetime DEFAULT NULL COMMENT '统计日期',
   add_count  varchar(40) DEFAULT NULL COMMENT '统计增量',
  PRIMARY KEY ( id )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS  aqs_org_info;
CREATE TABLE  aqs_org_info  (
   id  varchar(40) NOT NULL COMMENT '注册分中心id',
   org_code  varchar(40) DEFAULT NULL COMMENT '注册分中心编码',
   org_cn  varchar(40) DEFAULT NULL COMMENT '注册分中心名称',
   org_state  varchar(40) DEFAULT NULL COMMENT '注册分中心状态',
   create_time  datetime DEFAULT NULL COMMENT '创建时间',
   parent_id  varchar(40) DEFAULT NULL COMMENT '上级注册分中心id',
   inner_code  varchar(40) DEFAULT NULL COMMENT '注册分中心内部编码',
   tlevel  varchar(20) DEFAULT NULL COMMENT '注册分中心级别',
  PRIMARY KEY ( id ),
  KEY  indexorg_id  ( id ) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS  aqs_log_info;
CREATE TABLE  aqs_log_info  (
   ID  varchar(40) NOT NULL,
   operator  varchar(50) DEFAULT NULL COMMENT '操作者',
   operator_type  varchar(50) DEFAULT NULL COMMENT '操作类型',
   operator_content  varchar(255) DEFAULT NULL COMMENT '操作事件内容',
   operator_ip  varchar(50) DEFAULT NULL COMMENT '操作者IP',
   operator_result  varchar(50) DEFAULT NULL COMMENT '操作结果',
   create_time  datetime DEFAULT NULL COMMENT '操作时间',
   remark  varchar(50) DEFAULT NULL COMMENT '预留字段:备注',
  PRIMARY KEY ( ID )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  aqs_iam_admin_info ;
CREATE TABLE  aqs_iam_admin_info  (
   id  varchar(40) NOT NULL COMMENT 'id',
   cert_dn  varchar(50) DEFAULT NULL COMMENT '管理员证书主题',
   sn  varchar(40) DEFAULT NULL COMMENT '容人员编号',
   role  varchar(100) DEFAULT NULL COMMENT '角色',
  PRIMARY KEY ( id )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  aqs_dict ;
CREATE TABLE  aqs_dict  (
   id  varchar(50) NOT NULL COMMENT 'id',
   code  varchar(255) DEFAULT NULL COMMENT '字典编码',
   name  varchar(255) DEFAULT NULL COMMENT '字典名称',
   type  varchar(20) DEFAULT NULL COMMENT '字典类型',
   create_time  datetime DEFAULT NULL,
   update_time  datetime DEFAULT NULL,
  PRIMARY KEY ( id )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS  aqs_cert_info ;
CREATE TABLE  aqs_cert_info  (
   cert_sn  varchar(100) NOT NULL DEFAULT '' COMMENT '证书sn：证书序列号',
   cert_dn  varchar(50) DEFAULT NULL COMMENT '证书dn：证书主题',
   user_cn  varchar(40) DEFAULT NULL COMMENT '姓名',
   sn  varchar(40) DEFAULT NULL COMMENT '人员编号',
   template  varchar(60) DEFAULT NULL COMMENT '证书模板',
   state  varchar(20) DEFAULT NULL COMMENT '证书状态：Use：使用中；Undown：未下载；Hold：已冻结；Revoke：已注销,UndownRevoke:未下载注销',
   validity  varchar(50) DEFAULT NULL COMMENT '有效期(天）',
   isadmin  varchar(20) DEFAULT NULL COMMENT '1 普通证书，2 业务操作员，3 业务管理员，4 审计员，5审计管理员',
   notbefore  decimal(50,0) DEFAULT NULL COMMENT '证书生效时间',
   notafter  decimal(50,0) DEFAULT NULL COMMENT '证书失效时间',
   org_id  varchar(50) DEFAULT NULL COMMENT '注册分中心id',
   org_cn  varchar(40) DEFAULT NULL COMMENT '注册分中心名称',
   cert_type  varchar(30) DEFAULT NULL COMMENT '证书类型',
   create_time  datetime DEFAULT NULL COMMENT '创建时间',
   update_time  datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY ( cert_sn ),
  KEY  indexorgid  ( org_id ) USING BTREE,
  KEY  indexuserinfoId  ( user_cn ) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='证书表';

DROP TABLE IF EXISTS  aqs_admin_org ;
CREATE TABLE  aqs_admin_org  (
   reqsn  varchar(40) NOT NULL,
   certsn  varchar(40) DEFAULT NULL,
   org_id  varchar(50) NOT NULL,
   admin_status  varchar(10) DEFAULT NULL,
   isSubtree  varchar(10) NOT NULL,
   sign_server  varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
