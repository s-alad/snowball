// Code generated by MockGen. DO NOT EDIT.
// Source: signature_getter.go
//
// Generated by this command:
//
//	mockgen -package=aggregator -source=signature_getter.go -destination=mock_signature_getter.go -exclude_interfaces=NetworkClient
//

// Package aggregator is a generated GoMock package.
package aggregator

import (
	context "context"
	reflect "reflect"

	ids "github.com/ava-labs/avalanchego/ids"
	bls "github.com/ava-labs/avalanchego/utils/crypto/bls"
	warp "github.com/ava-labs/avalanchego/vms/platformvm/warp"
	gomock "go.uber.org/mock/gomock"
)

// MockSignatureGetter is a mock of SignatureGetter interface.
type MockSignatureGetter struct {
	ctrl     *gomock.Controller
	recorder *MockSignatureGetterMockRecorder
	isgomock struct{}
}

// MockSignatureGetterMockRecorder is the mock recorder for MockSignatureGetter.
type MockSignatureGetterMockRecorder struct {
	mock *MockSignatureGetter
}

// NewMockSignatureGetter creates a new mock instance.
func NewMockSignatureGetter(ctrl *gomock.Controller) *MockSignatureGetter {
	mock := &MockSignatureGetter{ctrl: ctrl}
	mock.recorder = &MockSignatureGetterMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockSignatureGetter) EXPECT() *MockSignatureGetterMockRecorder {
	return m.recorder
}

// GetSignature mocks base method.
func (m *MockSignatureGetter) GetSignature(ctx context.Context, nodeID ids.NodeID, unsignedWarpMessage *warp.UnsignedMessage) (*bls.Signature, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetSignature", ctx, nodeID, unsignedWarpMessage)
	ret0, _ := ret[0].(*bls.Signature)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetSignature indicates an expected call of GetSignature.
func (mr *MockSignatureGetterMockRecorder) GetSignature(ctx, nodeID, unsignedWarpMessage any) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetSignature", reflect.TypeOf((*MockSignatureGetter)(nil).GetSignature), ctx, nodeID, unsignedWarpMessage)
}
